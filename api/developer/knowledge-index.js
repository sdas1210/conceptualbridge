import { discoverQuestionFiles } from "../../services/questionLibraryEngine.js";

export default async function handler(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");

    if (req.method && req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    const subject = typeof req.query?.subject === "string"
        ? req.query.subject.trim().toLowerCase()
        : "";

    if (!subject) {
        return res.status(400).json({
            success: false,
            message: "Subject parameter is required"
        });
    }

    const allowedSubjects = new Set(["math", "gaca", "gi", "gs"]);

    if (!allowedSubjects.has(subject)) {
        return res.status(400).json({
            success: false,
            message: `Unsupported subject: ${subject}`
        });
    }

    try {
        const result = await discoverQuestionFiles(subject);

        if (!result || typeof result !== "object") {
            return res.status(500).json({
                success: false,
                message: "Knowledge Index Engine returned an invalid response"
            });
        }

        if (result.success === false) {
            const status =
                result.message === "Folder not found" ? 404 :
                result.message === "No question files found" ? 404 :
                500;

            return res.status(status).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Knowledge Index API error: ${error.message}`
        });
    }
}
