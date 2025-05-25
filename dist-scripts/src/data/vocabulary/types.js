"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWordBatch = createWordBatch;
// Helper functions for word management
function createWordBatch(words) {
    return {
        getWordBatch: function (start, count) { return words.slice(start, start + count); }
    };
}
