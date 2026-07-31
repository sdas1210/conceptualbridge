import fs from "fs";
import path from "path";

/**
 * Parse a single bilingual question file (Universal Parser for Math, GACA, GI, GS, etc.)
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

        // Validation: Requires Question Text, Options A-D, and a valid Correct answer
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

    /**
     * Helper to split option text on the first slash ('/') and handle English fallback
     * @param {string} rawVal 
     * @returns {{ eng: string, bng: string }}
     */
    function parseOptionValue(rawVal) {
        let eng = rawVal;
        let bng = rawVal;

        if (rawVal.includes("/")) {
            const slashIdx = rawVal.indexOf("/");
            eng = rawVal.substring(0, slashIdx).trim();
            const extractedBng = rawVal.substring(slashIdx + 1).trim();
            
            // Fallback to English if Bengali part is blank
            bng = extractedBng !== "" ? extractedBng : eng;
        }

        return { eng, bng };
    }

    for (const rawLine of lines) {

        const line = rawLine.trim();

        if (!line) continue;

        // ---------- NEW BILINGUAL QUESTION ----------

        if (line.startsWith("QEN|")) {

            saveCurrentQuestion();

            const textValue = line.substring(4).trim();

            currentQuestion = {

                // Core Quiz Engine Compatibility Properties
                text: textValue,
                textBn: textValue, // Default fallback to English question
                
                a: "",
                aBn: "",
                
                b: "",
                bBn: "",
                
                c: "",
                cBn: "",
                
                d: "",
                dBn: "",
                
                // Language Specific Field Objects
                questionEnglish: textValue,
                questionBengali: textValue, // Default fallback to English question

                equation: "",

                optionEnglish: {
                    a: "",
                    b: "",
                    c: "",
                    d: ""
                },

                optionBengali: {
                    a: "",
                    b: "",
                    c: "",
                    d: ""
                },

                correct: null,
                correctLetter: "",

                difficulty: 5,
                shift: "",
                image: "",

                topic: globalMetadata.topic,
                subTopic: globalMetadata.subTopic,

                QuestionID: "",

                // Global Metadata Inheritance
                exam: globalMetadata.exam,
                subject: globalMetadata.subject,
                level: globalMetadata.level,
                notification: globalMetadata.notification,
                type: globalMetadata.type,
                marks: globalMetadata.marks,
                qType: globalMetadata.qType
            
            };

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

        // Ignore question-specific fields until a QEN| is found
        if (!currentQuestion)
            continue;

        // ---------- BENGALI QUESTION TEXT ----------

        if (line.startsWith("QBN|")) {

            const value = line.substring(4).trim();

            if (value !== "") {
                currentQuestion.questionBengali = value;
                currentQuestion.textBn = value;
            }

            continue;

        }

        // ---------- COMMON / EQUATION ----------

        if (
            line.startsWith("Common|") ||
            line.startsWith("Equation|")
        ) {
        
            const value = line.substring(line.indexOf("|") + 1).trim();
        
            currentQuestion.equation = value;
        
            continue;
        
        }

        // ---------- OPTIONS (A|, B|, C|, D|) ----------

        if (line.startsWith("A|")) {

            const rawVal = line.substring(2).trim();
            const { eng, bng } = parseOptionValue(rawVal);

            currentQuestion.a = eng;
            currentQuestion.aBn = bng;
            
            currentQuestion.optionEnglish.a = eng;
            currentQuestion.optionBengali.a = bng;

            continue;

        }

        if (line.startsWith("B|")) {

            const rawVal = line.substring(2).trim();
            const { eng, bng } = parseOptionValue(rawVal);

            currentQuestion.b = eng;
            currentQuestion.bBn = bng;
            
            currentQuestion.optionEnglish.b = eng;
            currentQuestion.optionBengali.b = bng;

            continue;

        }

        if (line.startsWith("C|")) {

            const rawVal = line.substring(2).trim();
            const { eng, bng } = parseOptionValue(rawVal);

            currentQuestion.c = eng;
            currentQuestion.cBn = bng;
            
            currentQuestion.optionEnglish.c = eng;
            currentQuestion.optionBengali.c = bng;

            continue;

        }

        if (line.startsWith("D|")) {

            const rawVal = line.substring(2).trim();
            const { eng, bng } = parseOptionValue(rawVal);

            currentQuestion.d = eng;
            currentQuestion.dBn = bng;
            
            currentQuestion.optionEnglish.d = eng;
            currentQuestion.optionBengali.d = bng;

            continue;

        }

        // ---------- QUESTION OVERRIDES (TOPIC / SUBTOPIC) ----------

        if (line.startsWith("Topic|")) {

            const value = line.substring(6).trim();

            if (value !== "")
                currentQuestion.topic = value;

            continue;

        }

        if (line.startsWith("SubTopic|")) {

            const value = line.substring(9).trim();

            if (value !== "")
                currentQuestion.subTopic = value;

            continue;

        }

        // ---------- QUESTION ID ----------

        if (line.startsWith("QuestionID|")) {

            currentQuestion.QuestionID = line.substring(11).trim();

            continue;

        }

        // ---------- CORRECT ----------

        if (line.startsWith("Correct|")) {

            const ans = line.substring(8).trim().toUpperCase();

            currentQuestion.correctLetter = ans;

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

            let diff = parseFloat(line.substring(11).trim());
        
            if (isNaN(diff))
                diff = 5;
        
            diff = Math.max(1, Math.min(10, diff));
        
            currentQuestion.difficulty = diff;
        
            continue;
        
        }

        // ---------- SHIFT ----------

        if (line.startsWith("Shift|")) {

            currentQuestion.shift = line.substring(6).trim();

            continue;

        }

        // ---------- IMAGE ----------

        if (line.startsWith("Image|")) {

            const value = line.substring(6).trim();
        
            if (
                value !== "" &&
                globalMetadata.imageFolder !== ""
            ) {
        
                const base = globalMetadata.imageFolder.endsWith("/")
                    ? globalMetadata.imageFolder
                    : globalMetadata.imageFolder + "/";
                
                currentQuestion.image = base + value;
        
            }
            else {
        
                currentQuestion.image = "";
        
            }
        
            continue;
        
        }

    }

    saveCurrentQuestion();

    return questions;

}

/*
=================================================

CHANGE LOG

=================================================

Created Universal Bilingual Parser
File:
bilingualQuestionParser.js
Reason:
Provides a single, universal bilingual parser to replace subject-specific parsers (mathParser.js, questionParser.js) across all subjects including Mathematics, GACA, General Intelligence, and General Science.

--------------------------------------------

Standardized Question Start Delimiter
New Tag:
QEN|
Reason:
Standardizes question initialization on English question blocks (`QEN|`) across all bilingual question files.

--------------------------------------------

Added Automatic English Fallback for Bengali Questions
Reason:
Initializes `textBn` and `questionBengali` with the English question text by default. If `QBN|` is missing or blank, the parser automatically retains the English content so the UI never receives an empty Bengali string.

--------------------------------------------

Added Support for Common| Tag
Reason:
Supports `Common|` as an alias for `Equation|` to store passages, context, or LaTeX equations under `currentQuestion.equation`.

--------------------------------------------

Updated Option Parsing & Fallback Logic (A|, B|, C|, D|)
Reason:
Parses optional `/` slashes to separate English and Bengali option text. If no slash is present or if the Bengali portion is blank, automatically falls back to the English option string for `aBn`, `bBn`, `cBn`, `dBn` and `optionBengali`.

--------------------------------------------

Normalized Object Initialization
Reason:
Initializes all standard and subject-specific properties (`text`, `textBn`, `questionEnglish`, `questionBengali`, `equation`, `a`, `aBn`, `b`, `bBn`, `c`, `cBn`, `d`, `dBn`, `optionEnglish`, `optionBengali`, `correct`, `correctLetter`, `difficulty`, `shift`, `image`, `topic`, `subTopic`, `QuestionID`, and global metadata) on object creation to ensure a consistent data model.

--------------------------------------------

Preserved Quiz Engine Object Model & Architecture
Reason:
Maintains complete backward compatibility with the existing Quiz Engine and validation rules while supporting universal bilingual parsing.
*/