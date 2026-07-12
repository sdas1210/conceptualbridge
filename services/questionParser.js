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

            currentQuestion.passMark =
                11 - currentQuestion.difficulty;

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
            
                passMark: 6,
            
                shift: "",
            
                topic: "",
            
                exam: "",
            
                level: ""
            
            };

            continue;

        }

        if (!currentQuestion) continue;

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

            let diff =
                parseInt(line.substring(11).trim());

            if (isNaN(diff))
                diff = 5;

            diff =
                Math.min(
                    10,
                    Math.max(1, diff)
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

        // ---------- TOPIC ----------

        if (line.startsWith("Topic|")) {

            currentQuestion.topic =
                line.substring(6).trim();

            continue;

        }

        // ---------- EXAM ----------

        if (line.startsWith("Exam|")) {

            currentQuestion.exam =
                line.substring(5).trim();

            continue;

        }

        // ---------- LEVEL ----------

        if (line.startsWith("Level|")) {

            currentQuestion.level =
                line.substring(6).trim();

            continue;

        }

    }

    saveCurrentQuestion();

    return questions;

}
