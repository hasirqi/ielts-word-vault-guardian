"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var client_1 = require("@prisma/client");
var extendedIeltsWordList_1 = require("../src/data/extendedIeltsWordList");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var allWords, batchSize, i, batch, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    // 先清空表
                    console.log('正在清空数据库...');
                    return [4 /*yield*/, prisma.word.deleteMany()];
                case 1:
                    _a.sent();
                    allWords = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], extendedIeltsWordList_1.wordCategories.academic, true), extendedIeltsWordList_1.wordCategories.general, true), extendedIeltsWordList_1.wordCategories.science, true), extendedIeltsWordList_1.wordCategories.business, true), extendedIeltsWordList_1.wordCategories.technology, true), extendedIeltsWordList_1.wordCategories.environment, true);
                    console.log("\u603B\u8BCD\u6C47\u91CF: ".concat(allWords.length));
                    batchSize = 1000;
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < allWords.length)) return [3 /*break*/, 5];
                    batch = allWords.slice(i, i + batchSize).map(function (w) {
                        var _a, _b, _c;
                        return ({
                            id: w.id,
                            word: w.word,
                            phonetic: w.phonetic || '',
                            roots: ((_a = w.etymology) === null || _a === void 0 ? void 0 : _a.roots) || null,
                            affixes: ((_b = w.etymology) === null || _b === void 0 ? void 0 : _b.affixes) || null,
                            etymology: ((_c = w.etymology) === null || _c === void 0 ? void 0 : _c.explanation) || null,
                            definitionEn: w.definitions.en,
                            definitionZh: w.definitions.zh,
                            example: w.example || '',
                            lastReviewed: w.lastReviewed ? new Date(w.lastReviewed) : null,
                            nextReview: w.nextReview ? new Date(w.nextReview) : null,
                            reviewCount: w.reviewCount || 0, known: w.known || false
                        });
                    });
                    return [4 /*yield*/, prisma.word.createMany({
                            data: batch
                        })];
                case 3:
                    _a.sent();
                    console.log("\u5DF2\u5BFC\u5165 ".concat(Math.min((i + batchSize), allWords.length), " / ").concat(allWords.length, " \u4E2A\u8BCD"));
                    _a.label = 4;
                case 4:
                    i += batchSize;
                    return [3 /*break*/, 2];
                case 5:
                    console.log('词库导入完成！');
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('导入过程中出错:', error_1);
                    throw error_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(console.error)
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
