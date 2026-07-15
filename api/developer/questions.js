import fs from 'fs';
import path from 'path';
import { parseQuestionFile } from "../../services/questionParser.js";

export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const {
        action = "",
        topic = "GACA",
        file = "",
        id = "",
        search = ""
    } = req.query;

    let targetFolder = 'math';

    if (topic === 'GI') targetFolder = 'gi';
    if (topic === 'GS') targetFolder = 'gs';
    if (topic === 'GACA' || topic === 'gaca') targetFolder = 'gaca';

    try {
        
       switch (action) {
    
                case "topics":
                    return getTopics(res);
               
                case "files":
                    return getFiles(topic, res);
               
           case "load":
                return loadFile(topic, file, res);
               
               
                case "":
                    break;      // Old behaviour
            
                default:
            
                    return res.status(400).json({
            
                        status: "error",
            
                        message: "Unknown developer action"
            
                    });
            
            }

        const folderPath = path.join(
                process.cwd(),
                'questions',
                targetFolder
            );

        if (!fs.existsSync(folderPath)) {
            return res.status(404).json({
                status: 'error',
                message: 'Question folder not found'
            });
        }

        let allQuestions = [];

        // -------------------------
        // Load ONE FILE
        // -------------------------

        if (file) {

            const filePath = path.join(folderPath, file);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    status: 'error',
                    message: 'File not found'
                });
            }

            allQuestions = parseQuestionFile(
                filePath,
                targetFolder
            );

        }

        // -------------------------
        // Load ENTIRE FOLDER
        // -------------------------

        else {

            const txtFiles = fs.readdirSync(folderPath)
                .filter(f => f.endsWith('.txt'))
                .sort((a, b) =>
                    a.localeCompare(
                        b,
                        undefined,
                        { numeric: true }
                    )
                );

            for (const currentFile of txtFiles) {

                const filePath = path.join(
                    folderPath,
                    currentFile
                );

                const parsed = parseQuestionFile(
                    filePath,
                    targetFolder
                );

                parsed.forEach(q => {

                    q.__file = currentFile;

                });

                allQuestions.push(...parsed);

            }

        }

        // -------------------------
        // Find by Question Number
        // -------------------------

        

        // -------------------------
        // Find by Question ID
        // -------------------------

        if (id) {

            const found = allQuestions.find(
                q => String(q.id) === String(id)
            );

            if (!found) {

                return res.status(404).json({

                    status: 'error',

                    message: 'Question ID not found'

                });

            }

            return res.status(200).json({

                status: 'ok',

                question: found

            });

        }

        // -------------------------
        // Return Everything
        // -------------------------

        return res.status(200).json({

            status: 'ok',

            totalQuestions: allQuestions.length,

            data: allQuestions

        });

    }

    catch (err) {

        return res.status(500).json({

            status: 'error',

            message: err.message

        });

    }

}
    function getTopics(res) {

    return res.status(200).json({

        status: "ok",

        version: "0.1",

        data: [
            "GACA"
        ]

    });

}
// ==========================================
// Developer Helper Functions
// ==========================================

function getFiles(topic, res) {

    let targetFolder = "gaca";

    if (topic === "GI") targetFolder = "gi";
    if (topic === "GS") targetFolder = "gs";
    if (topic === "math") targetFolder = "math";

    const folderPath = path.join(
        process.cwd(),
        "questions",
        targetFolder
    );

    if (!fs.existsSync(folderPath)) {

        return res.status(404).json({

            status: "error",

            message: "Folder not found"

        });

    }

    const txtFiles = fs.readdirSync(folderPath)

        .filter(file => file.toLowerCase().endsWith(".txt"))

        .sort((a, b) =>
            a.localeCompare(
                b,
                undefined,
                { numeric: true }
            )
        );

    return res.status(200).json({

        status: "ok",

        version: "0.2",

        totalFiles: txtFiles.length,

        data: txtFiles

    });

}



function loadFile(topic, file, res) {

    return res.status(200).json({

        status: "ok",

        version: "0.3",

        topic,

        file

    });

}
