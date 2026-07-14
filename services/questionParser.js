import fs from "fs";
import path from "path";

/**
 * Parse a single question file
 * @param {string} filePath
 * @param {string} folder
 * @returns {Array<Question>}
 */
export function parseQuestionFile(filePath, folder = "") {

    const content = fs.readFileSync(filePath, "utf8");

    const lines = content.replace(/\r\n/g, "\n").split("\n");

    let questions = [];

    let currentQuestion = null;
    let globalMetadata = {

       exam: "",

        subject: "",
    
        topic: "",
    
        subTopic: "",
    
        level: "",
    
        notification: "",
    
        type: "",
    
        marks: 1,
    
        qType: "MCQ",
    
        imageFolder: ""
        
        };

    function saveCurrentQuestion() {

        if (!currentQuestion) return;

        // Validation

        if (
            currentQuestion.text &&
            currentQuestion.a &&
            currentQuestion.b &&
            currentQuestion.c &&
            currentQuestion.d &&
            currentQuestion.correct !== null
        ) {

            

            currentQuestion.sourceFile =
                path.basename(filePath);

            currentQuestion.folder = folder;

            questions.push(currentQuestion);

        }

    }

    for (const rawLine of lines) {

        const line = rawLine.trim();

        if (!line) continue;

        // ---------- NEW QUESTION ----------

        if (line.startsWith("Q|")) {

            saveCurrentQuestion();

            currentQuestion = {

                text: line.substring(2).trim(),

                a: "",
                b: "",
                c: "",
                d: "",
            
                correct: null,
            
                difficulty: 5,
            
                shift: "",
            
                image: "",
            
                exam: globalMetadata.exam,
            
                subject: globalMetadata.subject,
            
                topic: globalMetadata.topic,
            
                subTopic: globalMetadata.subTopic,
            
                level: globalMetadata.level,
            
                notification: globalMetadata.notification,
            
                type: globalMetadata.type,
            
                marks: globalMetadata.marks,
            
                qType: globalMetadata.qType

            
            };

            continue;

        }

        

        // ---------- OPTIONS ----------

        if (line.startsWith("A|")) {

            currentQuestion.a =
                line.substring(2).trim();

            continue;

        }

        if (line.startsWith("B|")) {

            currentQuestion.b =
                line.substring(2).trim();

            continue;

        }

        if (line.startsWith("C|")) {

            currentQuestion.c =
                line.substring(2).trim();

            continue;

        }

        if (line.startsWith("D|")) {

            currentQuestion.d =
                line.substring(2).trim();

            continue;

        }

        // ---------- CORRECT ----------

        if (line.startsWith("Correct|")) {

            const ans =
                line.substring(8).trim().toUpperCase();

            currentQuestion.correct =
                ans === "A" ? 0 :
                ans === "B" ? 1 :
                ans === "C" ? 2 :
                ans === "D" ? 3 :
                null;

            continue;

        }

        // ---------- DIFFICULTY ----------

        if (line.startsWith("Difficulty|")) {

            let diff = parseFloat(
                line.substring(11).trim()
            );
        
            if (isNaN(diff))
                diff = 5;
        
            diff = Math.max(
                1,
                Math.min(10, diff)
            );
        
            currentQuestion.difficulty = diff;
        
            continue;
        
        }

        // ---------- SHIFT ----------

        if (line.startsWith("Shift|")) {

            currentQuestion.shift =
                line.substring(6).trim();

            continue;

        }
        if (line.startsWith("Image|")) {

            const value = line.substring(6).trim();
        
            if (
        
                value !== "" &&
        
                globalMetadata.imageFolder !== ""
        
            ) {
        
                currentQuestion.image =
                    globalMetadata.imageFolder + value;
        
            }
        
            else {
        
                currentQuestion.image = "";
        
            }
        
            continue;
        
        }

        // ---------- GLOBAL METADATA ----------

        if (line.startsWith("Exam|")) {
        
            const value = line.substring(5).trim();
        
            if (value !== "")
                globalMetadata.exam = value;
        
            continue;
        
        }

        if (line.startsWith("Subject|")) {
        
            const value = line.substring(8).trim();
        
            if (value !== "")
                globalMetadata.subject = value;
        
            continue;
        
        }

        if (line.startsWith("Topic|")) {

            const value = line.substring(6).trim();
        
            if (value !== "")
                globalMetadata.topic = value;
        
            continue;
        
        }
        
        if (line.startsWith("SubTopic|")) {
        
            const value = line.substring(9).trim();
        
            if (value !== "")
                globalMetadata.subTopic = value;
        
            continue;
        
        }
        
        if (line.startsWith("Level|")) {
        
            const value = line.substring(6).trim();
        
            if (value !== "")
                globalMetadata.level = value;
        
            continue;
        
        }
        
        if (
        
            line.startsWith("Notification|") ||
        
            line.startsWith("Notificaiton|")
        
        ) {
        
            const value = line.substring(line.indexOf("|") + 1).trim();
        
            if (value !== "")
                globalMetadata.notification = value;
        
            continue;
        
        }
        
        if (line.startsWith("Type|")) {
        
            const value = line.substring(5).trim();
        
            if (value !== "")
                globalMetadata.type = value;
        
            continue;
        
        }
        if (line.startsWith("Marks|")) {

            const value = line.substring(6).trim();
        
            if (value !== "") {
        
                const marks = parseFloat(value);
        
                if (!isNaN(marks))
                    globalMetadata.marks = marks;
        
            }
        
            continue;
        
        }
        
        if (
        
            line.startsWith("QType|") ||
        
            line.startsWith("QuestionType|")
        
        ) {
        
            const value = line.substring(line.indexOf("|") + 1).trim();
        
            if (value !== "")
                globalMetadata.qType = value;
        
            continue;
        
        }
        
        if (line.startsWith("ImageFolder|")) {
        
            const value = line.substring(12).trim();
        
            if (value !== "")
                globalMetadata.imageFolder = value;
        
            continue;
        
        }

    }

    if (!currentQuestion) continue;

    saveCurrentQuestion();

    return questions;

}
