import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    // Enable CORS for client fetching
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
    const allowedSubjects = ["GACA", "MATH", "GI", "Science"];

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

        // 3. Filter for .txt files, parse IDs, and generate relative path
        const txtFiles = files
            .filter(file => file.toLowerCase().endsWith(".txt"))
            .map(file => {
                const nameWithoutExt = path.basename(file, ".txt");
                const parsedId = parseInt(nameWithoutExt, 10);
                
                // Pure numeric filenames map to numbers, others remain strings
                const isNumeric = /^\d+$/.test(nameWithoutExt) && !isNaN(parsedId);

                return {
                    id: isNumeric ? parsedId : nameWithoutExt,
                    filename: file,
                    path: `Video/${formattedSubject}/${file}`,
                    isNumeric: isNumeric
                };
            });

        // 4. Enhanced Sorting: Numeric files sorted ascending first, Non-numeric files sorted alphabetically after
        txtFiles.sort((a, b) => {
            if (a.isNumeric && b.isNumeric) {
                return a.id - b.id;
            }
            if (a.isNumeric && !b.isNumeric) {
                return -1; // Numeric comes before non-numeric
            }
            if (!a.isNumeric && b.isNumeric) {
                return 1; // Non-numeric comes after numeric
            }
            // Both are non-numeric: Alphabetical sort
            return String(a.id).localeCompare(String(b.id), undefined, { numeric: true, sensitivity: "base" });
        });

        // Remove temporary helper flag prior to output
        const formattedFiles = txtFiles.map(({ isNumeric, ...rest }) => rest);

        // 5. Success Response
        return res.status(200).json({
            success: true,
            subject: formattedSubject,
            count: formattedFiles.length,
            files: formattedFiles
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
