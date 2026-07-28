import fs from "fs";
import path from "path";

import { parseQuestionFile as parseGeneralQuestionFile } from "../services/questionParser.js";
import { parseQuestionFile as parseMathQuestionFile } from "../services/mathParser.js";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

}
