// =========================================
// TOPIC & SUBTOPIC LOGGER
// Conceptual Bridge Maintenance Suite
// =========================================


// =========================================
// SUBJECT REFERENCES
// =========================================

const mathLoggerBtn =
    document.getElementById(
        "mathLoggerBtn"
    );


const giLoggerBtn =
    document.getElementById(
        "giLoggerBtn"
    );


const scienceLoggerBtn =
    document.getElementById(
        "scienceLoggerBtn"
    );


// =========================================
// DEVELOPMENT STATE
// =========================================

const loggerModes = {

    math: {

        enabled:
            false

    },

    generalIntelligence: {

        enabled:
            false

    },

    science: {

        enabled:
            false

    }

};


// =========================================
// INITIALIZE
// =========================================

function initializeTopicSubTopicLogger() {

    mathLoggerBtn.disabled =
        !loggerModes
            .math
            .enabled;


    giLoggerBtn.disabled =
        !loggerModes
            .generalIntelligence
            .enabled;


    scienceLoggerBtn.disabled =
        !loggerModes
            .science
            .enabled;

}


initializeTopicSubTopicLogger();
