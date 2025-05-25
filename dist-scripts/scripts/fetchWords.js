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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function fetchWordData(word, index) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("https://api.dictionaryapi.dev/api/v2/entries/en/".concat(word))];
                case 1:
                    response = _e.sent();
                    data = response.data[0];
                    return [2 /*return*/, {
                            id: String(index + 1),
                            word: word,
                            phonetic: data.phonetic || '',
                            etymology: {
                                roots: '', // 需要从其他API获取
                                affixes: '',
                                explanation: data.origin || ''
                            },
                            definitions: {
                                en: ((_b = (_a = data.meanings[0]) === null || _a === void 0 ? void 0 : _a.definitions[0]) === null || _b === void 0 ? void 0 : _b.definition) || '',
                                zh: '' // 需要从翻译API获取
                            },
                            example: ((_d = (_c = data.meanings[0]) === null || _c === void 0 ? void 0 : _c.definitions[0]) === null || _d === void 0 ? void 0 : _d.example) || '',
                            lastReviewed: null,
                            nextReview: null,
                            reviewCount: 0
                        }];
                case 2:
                    error_1 = _e.sent();
                    console.error("Error fetching data for word: ".concat(word), error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var ieltsWordList, wordList, results, i, word, data, outputPath, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ieltsWordList = require('./wordList').ieltsWordList;
                    wordList = ieltsWordList;
                    results = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < wordList.length)) return [3 /*break*/, 4];
                    word = wordList[i];
                    return [4 /*yield*/, fetchWordData(word, i)];
                case 2:
                    data = _a.sent();
                    if (data) {
                        results.push(data);
                    }
                    // 每100个词保存一次，防止数据丢失
                    if (i % 100 === 0) {
                        outputPath = path_1.default.join(__dirname, '../src/data/generatedWords.ts');
                        content = "export const generatedWords = ".concat(JSON.stringify(results, null, 2), ";");
                        fs_1.default.writeFileSync(outputPath, content);
                        console.log("Processed ".concat(i + 1, " words"));
                    }
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
