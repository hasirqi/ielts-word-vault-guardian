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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWords = getWords;
exports.updateWordStatus = updateWordStatus;
exports.updateWordReview = updateWordReview;
exports.importLocalWords = importLocalWords;
exports.clearWords = clearWords;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// 判断运行环境
var isBrowser = typeof window !== 'undefined';
function getWords() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1, words, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isBrowser) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/words')];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error('API error');
                    return [4 /*yield*/, res.json()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_1 = _a.sent();
                    console.error('前端 getWords 失败:', error_1);
                    return [2 /*return*/, []];
                case 5: return [3 /*break*/, 9];
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, prisma.word.findMany()];
                case 7:
                    words = _a.sent();
                    return [2 /*return*/, words.map(function (word) {
                            var _a, _b;
                            return ({
                                id: word.id,
                                word: word.word,
                                phonetic: word.phonetic,
                                roots: word.roots,
                                affixes: word.affixes,
                                etymology: word.etymology,
                                definitionEn: word.definitionEn,
                                definitionZh: word.definitionZh,
                                example: word.example,
                                lastReviewed: ((_a = word.lastReviewed) === null || _a === void 0 ? void 0 : _a.getTime()) || null,
                                nextReview: ((_b = word.nextReview) === null || _b === void 0 ? void 0 : _b.getTime()) || null,
                                reviewCount: word.reviewCount,
                                known: word.known,
                            });
                        })];
                case 8:
                    error_2 = _a.sent();
                    console.error('Error fetching words:', error_2);
                    return [2 /*return*/, []];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function updateWordStatus(id, known) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isBrowser) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch("/api/words/".concat(id), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ known: known })
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.ok];
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, prisma.word.update({
                            where: { id: id },
                            data: { known: known }
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    error_3 = _a.sent();
                    console.error('Error updating word:', error_3);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function updateWordReview(id, successful) {
    return __awaiter(this, void 0, void 0, function () {
        var res, word, now, reviewIntervals, nextInterval, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isBrowser) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch("/api/words/".concat(id, "/review"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ successful: successful })
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.ok];
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, prisma.word.findUnique({ where: { id: id } })];
                case 3:
                    word = _a.sent();
                    if (!word)
                        return [2 /*return*/, false];
                    now = new Date();
                    reviewIntervals = [1, 24, 72, 168, 336, 672, 1344];
                    nextInterval = successful ?
                        (word.reviewCount >= reviewIntervals.length ? reviewIntervals[reviewIntervals.length - 1] : reviewIntervals[word.reviewCount]) :
                        reviewIntervals[0];
                    return [4 /*yield*/, prisma.word.update({
                            where: { id: id },
                            data: {
                                lastReviewed: now,
                                nextReview: new Date(now.getTime() + nextInterval * 60 * 60 * 1000),
                                reviewCount: successful ? word.reviewCount + 1 : 1,
                            }
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, true];
                case 5:
                    error_4 = _a.sent();
                    console.error('Error updating word review:', error_4);
                    return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function importLocalWords() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isBrowser) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch('/api/words/batch', { method: 'POST' })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.json()];
                case 2: 
                // 后端批量导入逻辑可补充
                return [2 /*return*/, { success: true }];
            }
        });
    });
}
function clearWords() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isBrowser) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch('/api/words/clear', { method: 'POST' })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.json()];
                case 2: 
                // 后端清空逻辑可补充
                return [2 /*return*/, { success: true }];
            }
        });
    });
}
