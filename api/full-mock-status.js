import fs from "fs";
import path from "path";

import { parseQuestionFile as parseGeneralQuestionFile } from "../services/questionParser.js";
import { parseQuestionFile as parseMathQuestionFile } from "../services/mathParser.js";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    const MINIMUM_FULL_MOCK_QUESTIONS = 30;

    const subjects = [
        {
            name: "MATH",
            folder: "math",
            parser: parseMathQuestionFile
        },
        {
            name: "GI",
            folder: "gi",
            parser: parseGeneralQuestionFile
        },
        {
            name: "GS",
            folder: "gs",
            parser: parseGeneralQuestionFile
        },
        {
            name: "GACA",
            folder: "gaca",
            parser: parseGeneralQuestionFile
        }
    ];

    const subjectStatus = {};

for (const subject of subjects) {

    const folderPath = path.join(
        process.cwd(),
        "questions",
        subject.folder
    );

    if (!fs.existsSync(folderPath)) {

        subjectStatus[subject.name] = 0;
        continue;

    }

    const txtFiles = fs.readdirSync(folderPath)

        .filter(file => file.toLowerCase().endsWith(".txt"))

        .sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true })
        );

    let totalQuestions = 0;

    for (const currentFile of txtFiles) {

        const filePath = path.join(
            folderPath,
            currentFile
        );

        const parsedQuestions =
            subject.parser(filePath, subject.folder);

        totalQuestions += parsedQuestions.length;

    }

    subjectStatus[subject.name] = totalQuestions;

}
    const fullMockReady =

    subjectStatus.MATH >= MINIMUM_FULL_MOCK_QUESTIONS &&

    subjectStatus.GI >= MINIMUM_FULL_MOCK_QUESTIONS &&

    subjectStatus.GS >= MINIMUM_FULL_MOCK_QUESTIONS &&

    subjectStatus.GACA >= MINIMUM_FULL_MOCK_QUESTIONS;

return res.status(200).json({

    status: "ok",

    fullMockReady

});

}


