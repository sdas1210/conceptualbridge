import fs from "fs";
import path from "path";

/**
 * Parse a single Mathematics question file
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

        // ---------- NEW MATHEMATICS QUESTION ----------

        if (line.startsWith("QEN|")) {

            saveCurrentQuestion();

            const textValue = line.substring(4).trim();

            currentQuestion = {

                // Existing Quiz Engine Compatibility Properties
                text: textValue,

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
            
                qType: globalMetadata.qType,

                // Mathematics Specific Properties
                questionEnglish: textValue,

                questionBengali: "",

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

                correctLetter: "",

                QuestionID: ""
            
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

            currentQuestion.questionBengali =
                line.substring(4).trim();

            continue;

        }

       // ---------- COMMON / EQUATION ----------

        if (
            line.startsWith("Common|") ||
            line.startsWith("Equation|")
        ) {
        
            const value =
                line.substring(line.indexOf("|") + 1).trim();
        
            currentQuestion.equation = value;
        
            continue;
        
        }

        // ---------- OPTIONS ----------

        if (line.startsWith("A|")) {

            const rawVal = line.substring(2).trim();

            if (rawVal.includes("/")) {
                const slashIdx = rawVal.indexOf("/");
                const eng = rawVal.substring(0, slashIdx).trim();
                const bng = rawVal.substring(slashIdx + 1).trim();

                currentQuestion.a = eng;
                currentQuestion.optionEnglish.a = eng;
                currentQuestion.optionBengali.a = bng;
            } else {
                currentQuestion.a = rawVal;
                currentQuestion.optionEnglish.a = rawVal;
                currentQuestion.optionBengali.a = rawVal;
            }

            continue;

        }

        if (line.startsWith("B|")) {

            const rawVal = line.substring(2).trim();

            if (rawVal.includes("/")) {
                const slashIdx = rawVal.indexOf("/");
                const eng = rawVal.substring(0, slashIdx).trim();
                const bng = rawVal.substring(slashIdx + 1).trim();

                currentQuestion.b = eng;
                currentQuestion.optionEnglish.b = eng;
                currentQuestion.optionBengali.b = bng;
            } else {
                currentQuestion.b = rawVal;
                currentQuestion.optionEnglish.b = rawVal;
                currentQuestion.optionBengali.b = rawVal;
            }

            continue;

        }

        if (line.startsWith("C|")) {

            const rawVal = line.substring(2).trim();

            if (rawVal.includes("/")) {
                const slashIdx = rawVal.indexOf("/");
                const eng = rawVal.substring(0, slashIdx).trim();
                const bng = rawVal.substring(slashIdx + 1).trim();

                currentQuestion.c = eng;
                currentQuestion.optionEnglish.c = eng;
                currentQuestion.optionBengali.c = bng;
            } else {
                currentQuestion.c = rawVal;
                currentQuestion.optionEnglish.c = rawVal;
                currentQuestion.optionBengali.c = rawVal;
            }

            continue;

        }

        if (line.startsWith("D|")) {

            const rawVal = line.substring(2).trim();

            if (rawVal.includes("/")) {
                const slashIdx = rawVal.indexOf("/");
                const eng = rawVal.substring(0, slashIdx).trim();
                const bng = rawVal.substring(slashIdx + 1).trim();

                currentQuestion.d = eng;
                currentQuestion.optionEnglish.d = eng;
                currentQuestion.optionBengali.d = bng;
            } else {
                currentQuestion.d = rawVal;
                currentQuestion.optionEnglish.d = rawVal;
                currentQuestion.optionBengali.d = rawVal;
            }

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

            currentQuestion.QuestionID =
                line.substring(11).trim();

            continue;

        }

        // ---------- CORRECT ----------

        if (line.startsWith("Correct|")) {

            const ans =
                line.substring(8).trim().toUpperCase();

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

Changed Question Delimiter
Old:
Q|
New:
QEN|
Reason:
Mathematics files use QEN| to indicate the start of an English question block.

--------------------------------------------

Added QBN Parsing
Reason:
Supports Bengali translation/text for Mathematics questions (`questionBengali`).

--------------------------------------------

Added Equation Parsing
Reason:
Supports mathematical formulas and raw LaTeX expressions (`equation`).

--------------------------------------------

Updated Options Parsing Format (A|, B|, C|, D|)
Reason:
Retained traditional A|, B|, C|, D| prefixes while adding optional inline slash parsing (`English / Bengali`). If a slash is present, splits on the first slash into `optionEnglish` and `optionBengali`. If no slash is present, assigns the full string to both `optionEnglish` and `optionBengali`. Standard Quiz Engine fields (`a`, `b`, `c`, `d`) receive the English value in both scenarios.

--------------------------------------------

Added Question-Level Topic and SubTopic Parsing
Reason:
Allows specific Mathematics questions to override file-level global metadata topics/subtopics.

--------------------------------------------

Added QuestionID Parsing
Reason:
Supports permanent, unique Mathematics question identification across portals and review modes.

--------------------------------------------

Added correctLetter Property
Reason:
Retains string representation of answer ("A", "B", "C", "D") alongside numeric index `correct` used by Quiz Engine.

--------------------------------------------

Preserved Quiz Engine Object Model & Architecture
Reason:
Maintains complete structural compatibility with existing Quiz Engine (`text`, `a`, `b`, `c`, `d`, `correct`, `difficulty`, etc.) while gracefully handling optional fields.
*/
