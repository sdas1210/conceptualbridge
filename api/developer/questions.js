import fs from 'fs';
import path from 'path';
import { parseQuestionFile } from "../../services/bilingualQuestionParser.js";

const QUESTIONS_ROOT = path.join(process.cwd(), 'questions');

/**
 * Validates that the requested target path stays strictly inside /questions/
 */
function isSafePath(baseDir, targetPath) {
    const relative = path.relative(baseDir, targetPath);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

/**
 * Deterministically splits raw TXT file into question blocks matching parsed questions
 * @param {string} content 
 * @returns {Array<string>}
 */
function extractRawSourceBlocks(content) {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const blocks = [];
    let currentLines = [];
    let hasStarted = false;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line.startsWith("QEN|") || line.startsWith("Q|")) {
            if (hasStarted && currentLines.length > 0) {
                blocks.push(currentLines.join('\n').trim());
                currentLines = [];
            }
            hasStarted = true;
        }
        if (hasStarted) {
            currentLines.push(rawLine);
        }
    }

    if (hasStarted && currentLines.length > 0) {
        blocks.push(currentLines.join('\n').trim());
    }

    return blocks;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const {
        action = "",
        topic = "",
        file = ""
    } = req.query;

    if (!fs.existsSync(QUESTIONS_ROOT)) {
        return res.status(500).json({
            status: 'error',
            message: 'Questions directory not found on server'
        });
    }

    try {
        switch (action) {
            case "topics":
                return getTopics(res);
            case "files":
                return getFiles(topic, res);
            case "load":
                return loadFile(topic, file, res);
            default:
                return res.status(400).json({
                    status: "error",
                    message: "Unknown developer action"
                });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

/**
 * Dynamically scans /questions/ for immediate subdirectories
 */
function getTopics(res) {
    try {
        const entries = fs.readdirSync(QUESTIONS_ROOT, { withFileTypes: true });
        const topics = entries
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        return res.status(200).json({
            status: "ok",
            version: "1.0",
            data: topics
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Failed to scan topics directory"
        });
    }
}

/**
 * Dynamically scans /questions/<topic>/ for all .txt files
 */
function getFiles(topic, res) {
    if (!topic || typeof topic !== 'string') {
        return res.status(400).json({
            status: "error",
            message: "Topic parameter is required"
        });
    }

    const entries = fs.readdirSync(QUESTIONS_ROOT, { withFileTypes: true });
    const matchedEntry = entries.find(entry => entry.isDirectory() && entry.name.toLowerCase() === topic.toLowerCase());

    if (!matchedEntry) {
        return res.status(404).json({
            status: "error",
            message: `Question topic folder "${topic}" not found`
        });
    }

    const folderPath = path.join(QUESTIONS_ROOT, matchedEntry.name);

    if (!isSafePath(QUESTIONS_ROOT, folderPath)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid topic path"
        });
    }

    try {
        const txtFiles = fs.readdirSync(folderPath)
            .filter(file => file.toLowerCase().endsWith(".txt"))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        return res.status(200).json({
            status: "ok",
            version: "1.0",
            totalFiles: txtFiles.length,
            data: txtFiles
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Failed to read files for topic"
        });
    }
}

/**
 * Loads and parses a single question file using the existing universal parser
 */
function loadFile(topic, file, res) {
    if (!topic || !file) {
        return res.status(400).json({
            status: "error",
            message: "Both topic and file parameters are required"
        });
    }

    const entries = fs.readdirSync(QUESTIONS_ROOT, { withFileTypes: true });
    const matchedEntry = entries.find(entry => entry.isDirectory() && entry.name.toLowerCase() === topic.toLowerCase());

    if (!matchedEntry) {
        return res.status(404).json({
            status: "error",
            message: `Question topic folder "${topic}" not found`
        });
    }

    if (
        typeof file !== "string" ||
        !file.toLowerCase().endsWith(".txt") ||
        file.includes("/") ||
        file.includes("\\")
    ) {
        return res.status(400).json({
            status: "error",
            message: "Only valid .txt question files are allowed"
        });
    }

    const folderPath = path.join(QUESTIONS_ROOT, matchedEntry.name);
    const filePath = path.join(folderPath, file);

    if (!isSafePath(QUESTIONS_ROOT, filePath) || !fs.existsSync(filePath)) {
        return res.status(404).json({
            status: "error",
            message: `File "${file}" not found in topic "${topic}"`
        });
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const questions = parseQuestionFile(filePath, matchedEntry.name.toLowerCase());
        const sourceBlocks = extractRawSourceBlocks(fileContent);

        return res.status(200).json({
            status: "ok",
            version: "1.0",
            questionCount: questions.length,
            data: questions,
            sourceBlocks: sourceBlocks
        });
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: `Failed to parse question file: ${err.message}`
        });
    }
}
