"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordCategories = exports.extendedIeltsWordList = void 0;
exports.getWordBatch = getWordBatch;
exports.getFullWordList = getFullWordList;
exports.getAcademicWords = getAcademicWords;
exports.getGeneralWords = getGeneralWords;
exports.getScienceWords = getScienceWords;
exports.getBusinessWords = getBusinessWords;
exports.getTechnologyWords = getTechnologyWords;
exports.getEnvironmentWords = getEnvironmentWords;
var academic_1 = require("./academic");
var general_1 = require("./general");
var science_1 = require("./science");
var business_1 = require("./business");
var technology_1 = require("./technology");
var environment_1 = require("./environment");
// Combine all word lists
exports.extendedIeltsWordList = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], academic_1.academicWords, true), general_1.generalWords, true), science_1.scienceWords, true), business_1.businessWords, true), technology_1.technologyWords, true), environment_1.environmentWords, true);
// Function to get a subset of the word list (for pagination or performance)
function getWordBatch(start, count) {
    return exports.extendedIeltsWordList.slice(start, start + count);
}
// Function to get the full word list
function getFullWordList() {
    return exports.extendedIeltsWordList;
}
// Get words by category
function getAcademicWords() {
    return academic_1.academicWords;
}
function getGeneralWords() {
    return general_1.generalWords;
}
function getScienceWords() {
    return science_1.scienceWords;
}
function getBusinessWords() {
    return business_1.businessWords;
}
function getTechnologyWords() {
    return technology_1.technologyWords;
}
function getEnvironmentWords() {
    return environment_1.environmentWords;
}
// Export all categories for convenience
exports.wordCategories = {
    academic: academic_1.academicWords,
    general: general_1.generalWords,
    science: science_1.scienceWords,
    business: business_1.businessWords,
    technology: technology_1.technologyWords,
    environment: environment_1.environmentWords,
};
