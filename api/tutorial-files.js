import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    // Enable CORS if needed (optional for Vercel deployment)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed. Use GET."
        });
    }

    const { subject } = req.query;

    // 1. Validation: Check missing parameter
    if (!subject || typeof subject !== "string" || subject.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Missing subject parameter."
        });
    }

    const formattedSubject = subject.trim();
    const allowedSubjects = ["GACA", "Math", "GI", "Science"];

    // 2. Validation: Check subject whitelist
    if (!allowedSubjects.includes(formattedSubject)) {
        return res.status(400).json({
            success: false,
            message: `Invalid subject parameter. Must be one of: ${allowedSubjects.join(", ")}`
        });
    }

    try {
        // Resolve absolute path to Video/<subject>/ relative to project root
        const targetDir = path.join(process.cwd(), "Video", formattedSubject);

        // Read folder directory contents
        const files = await fs.readdir(targetDir);

        // 3. Filter for .txt files and parse numeric IDs
        const txtFiles = files
            .filter(file => file.toLowerCase().endsWith(".txt"))
            .map(file => {
                const nameWithoutExt = path.basename(file, ".txt");
                const parsedId = parseInt(nameWithoutExt, 10);
                return {
                    id: isNaN(parsedId) ? nameWithoutExt : parsedId,
                    filename: file
                };
            });

        // 4. Natural/Numeric Sorting (e.g. 1.txt, 2.txt, 10.txt)
        txtFiles.sort((a, b) => {
            if (typeof a.id === "number" && typeof b.id === "number") {
                return a.id - b.id;
            }
            return String(a.id).localeCompare(String(b.id), undefined, { numeric: true, sensitivity: "base" });
        });

        // 5. Success Response
        return res.status(200).json({
            success: true,
            subject: formattedSubject,
            count: txtFiles.length,
            files: txtFiles
        });

    } catch (error) {
        // Handle folder not found (ENOENT)
        if (error.code === "ENOENT") {
            return res.status(404).json({
                success: false,
                message: "Subject folder not found."
            });
        }

        // Generic Server Error
        console.error("Error reading subject directory:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error reading files."
        });
    }
}
