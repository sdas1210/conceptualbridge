import { parseAnchorTXT } from "../../developer/maintenance/shared/anchorImporter.js";
import { buildRuntimeGacaAnchor } from "./gacaAnchorParser.js";
import { buildRuntimeMathAnchor } from "./mathAnchorParser.js";
import { loadKnowledgeLibrary } from "./knowledgeLibraryLoader.js";
import { resolveCandidates } from "./candidateResolver.js";
import { buildQuestionPool } from "./questionPoolBuilder.js";
import { selectRandomQuestions } from "./randomQuestionSelector.js";
import { buildApiResponse } from "./apiResponseBuilder.js";

/**
 * Conceptual Bridge - Knowledge Runtime v1.0
 * Module: Runtime Engine
 * 
 * Orchestrates all runtime subsystems (importer, adapter, library loader, candidate resolver,
 * pool builder, selector, and API response builder) into a unified runtime execution pipeline.
 */

/**
 * Executes the complete Knowledge Runtime pipeline.
 *
 * @param {Object} options - Pipeline options.
 * @param {string} [options.rawAnchorText=null] - Raw TXT content of an anchor file.
 * @param {Object} [options.anchorData=null] - Normalized anchor object (if already parsed).
 * @param {number} [options.requestedQuestions=null] - Number of random questions requested.
 * @param {any} [options.randomSeed=null] - Seed parameter for future deterministic randomization.
 * @param {boolean} [options.debug=false] - Enables complete context state inspection on success.
 * @returns {Promise<Object>} Final API response payload, error payload, or full debug context.
 */
export async function runRuntime(options = {}) {
    // =========================================================================
    // SECTION 1: Input Validation & Context Initialization
    // =========================================================================
    const opts = options || {};
    const rawAnchorText = opts.rawAnchorText || null;
    let anchorData = opts.anchorData || null;
    const requestedQuestions = opts.requestedQuestions || null;
    const debug = Boolean(opts.debug);

    if (!rawAnchorText && !anchorData) {
        return {
            success: false,
            error: "INVALID_INPUT"
        };
    }

    const context = {
        input: opts,
        anchor: null,
        runtimeAnchor: null,
        knowledgeLibrary: null,
        candidateFiles: null,
        questionPool: null,
        selection: null,
        apiResponse: null
    };

    // =========================================================================
    // SECTION 2: Anchor Preparation
    // =========================================================================
    if (rawAnchorText) {
        try {
            const importResult = parseAnchorTXT(rawAnchorText);
            if (importResult.errors && importResult.errors.length > 0) {
                return {
                    success: false,
                    error: "ANCHOR_PARSE_FAILED",
                    details: importResult.errors
                };
            }
            anchorData = importResult.anchor;
        } catch {
            return {
                success: false,
                error: "ANCHOR_PARSE_FAILED"
            };
        }
    }

    if (!anchorData || typeof anchorData !== "object") {
        return {
            success: false,
            error: "INVALID_ANCHOR_DATA"
        };
    }

    context.anchor = anchorData;

    // =========================================================================
    // SECTION 3: Runtime Adapter
    // =========================================================================
    const mode = (anchorData.mode || "").trim().toUpperCase();
    let adapterResult = null;

    if (mode === "GACA") {
        adapterResult = buildRuntimeGacaAnchor(anchorData);
    } else if (mode === "MATH") {
        adapterResult = buildRuntimeMathAnchor(anchorData);
    } else {
        return {
            success: false,
            error: "UNSUPPORTED_MODE"
        };
    }

    if (!adapterResult || !adapterResult.success) {
        return {
            success: false,
            error: adapterResult?.errors?.[0] || "ADAPTER_FAILED"
        };
    }

    context.runtimeAnchor = adapterResult.runtimeAnchor;

    // =========================================================================
    // SECTION 4: Knowledge Loading
    // =========================================================================
    const subject = context.runtimeAnchor.mode.toLowerCase();
    const libraryResult = await loadKnowledgeLibrary(subject);

    if (!libraryResult || !libraryResult.success) {
        return libraryResult;
    }

    context.knowledgeLibrary = libraryResult.library;

    // =========================================================================
    // SECTION 5: Candidate Resolution
    // =========================================================================
    // Construct canonical runtime anchor for candidate resolution
    const resolverResult = resolveCandidates(
        context.runtimeAnchor.resolution,
        context.knowledgeLibrary
    );

    if (!resolverResult || !resolverResult.success) {
        return resolverResult;
    }

    context.candidateFiles = resolverResult;

    // =========================================================================
    // SECTION 6: Question Pool
    // =========================================================================
    const poolRequest = {
        subject: subject,
        mode: resolverResult.mode,
        files: resolverResult.files
    };

    const poolResult = await buildQuestionPool(poolRequest);

    if (!poolResult || !poolResult.success) {
        return poolResult;
    }

    context.questionPool = poolResult;

    // =========================================================================
    // SECTION 7: Random Selection
    // =========================================================================
    const availableQuestions = poolResult.questions ? poolResult.questions.length : 0;
    const countToSelect = (typeof requestedQuestions === "number" && requestedQuestions > 0)
        ? requestedQuestions
        : availableQuestions;

    const selectorResult = selectRandomQuestions(poolResult, countToSelect);

    if (!selectorResult || !selectorResult.success) {
        return selectorResult;
    }

    context.selection = selectorResult;

    // =========================================================================
    // SECTION 8: API Response
    // =========================================================================
    const apiResponse = buildApiResponse(selectorResult);

    if (!apiResponse || !apiResponse.success) {
        return apiResponse;
    }

    context.apiResponse = apiResponse;

    if (debug) {
        return {
            success: true,
            context: context
        };
    }

    return context.apiResponse;
}
