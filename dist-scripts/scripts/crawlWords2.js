"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var cheerio = __importStar(require("cheerio"));
var client_1 = require("@prisma/client");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var prisma = new client_1.PrismaClient();
// 防止API限流
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var randomSleep = function () { return sleep(Math.random() * 3000 + 2000); };
// 从Free Dictionary API获取单词信息
function fetchWordDetails(word) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, phonetic, definitionEn, example, meaning, _i, _a, def, error_1;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("https://api.dictionaryapi.dev/api/v2/entries/en/".concat(encodeURIComponent(word)), {
                            timeout: 5000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        })];
                case 1:
                    response = _f.sent();
                    data = response.data[0];
                    phonetic = data.phonetic || '';
                    if (!phonetic && ((_b = data.phonetics) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                        phonetic = ((_c = data.phonetics.find(function (p) { return p.text; })) === null || _c === void 0 ? void 0 : _c.text) || '';
                    }
                    definitionEn = '';
                    example = '';
                    if (((_d = data.meanings) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                        meaning = data.meanings[0];
                        if (((_e = meaning.definitions) === null || _e === void 0 ? void 0 : _e.length) > 0) {
                            definitionEn = meaning.definitions[0].definition || '';
                            example = meaning.definitions[0].example || '';
                            // 如果第一个定义没有例句，寻找其他定义的例句
                            if (!example) {
                                for (_i = 0, _a = meaning.definitions.slice(1); _i < _a.length; _i++) {
                                    def = _a[_i];
                                    if (def.example) {
                                        example = def.example;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    return [2 /*return*/, {
                            success: true,
                            data: {
                                phonetic: phonetic ? "/".concat(phonetic, "/") : '',
                                definitionEn: definitionEn,
                                example: example
                            }
                        }];
                case 2:
                    error_1 = _f.sent();
                    console.error("Error fetching ".concat(word, ":"), error_1.message);
                    return [2 /*return*/, { success: false }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 从有道词典获取中文释义
function fetchChineseDefinition(word) {
    return __awaiter(this, void 0, void 0, function () {
        var response, $, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("https://dict.youdao.com/w/".concat(encodeURIComponent(word)), {
                            timeout: 5000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    $ = cheerio.load(response.data);
                    return [2 /*return*/, $('#phrsListTab .trans-container ul li').first().text() || ''];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error fetching Chinese definition for ".concat(word, ":"), error_2.message);
                    return [2 /*return*/, ''];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 加载进度
function loadProgress() {
    var progressPath = path_1.default.join(__dirname, 'crawl_progress.json');
    if (fs_1.default.existsSync(progressPath)) {
        try {
            var progress = JSON.parse(fs_1.default.readFileSync(progressPath, 'utf-8'));
            return progress.lastProcessedIndex || 0;
        }
        catch (_a) {
            return 0;
        }
    }
    return 0;
}
// 保存进度
function saveProgress(index, total) {
    var progressPath = path_1.default.join(__dirname, 'crawl_progress.json');
    fs_1.default.writeFileSync(progressPath, JSON.stringify({
        lastProcessedIndex: index,
        totalWords: total,
        timestamp: new Date().toISOString()
    }));
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var wordListPath, words, startIndex, i, word, details, definitionZh, error_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 15, 16, 18]);
                    wordListPath = path_1.default.join(__dirname, 'ielts_core_words.txt');
                    words = fs_1.default.readFileSync(wordListPath, 'utf-8')
                        .split('\n')
                        .map(function (word) { return word.trim(); })
                        .filter(function (word) { return word; });
                    console.log("\u8BFB\u53D6\u5230 ".concat(words.length, " \u4E2A\u5355\u8BCD"));
                    startIndex = loadProgress();
                    console.log("\u4ECE\u7B2C ".concat(startIndex + 1, " \u4E2A\u5355\u8BCD\u7EE7\u7EED\u5904\u7406"));
                    if (!(startIndex === 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, prisma.word.deleteMany()];
                case 1:
                    _a.sent();
                    console.log('数据库已清空');
                    _a.label = 2;
                case 2:
                    i = startIndex;
                    _a.label = 3;
                case 3:
                    if (!(i < words.length)) return [3 /*break*/, 14];
                    word = words[i];
                    console.log("[".concat(i + 1, "/").concat(words.length, "] \u5904\u7406: ").concat(word));
                    return [4 /*yield*/, fetchWordDetails(word)];
                case 4:
                    details = _a.sent();
                    return [4 /*yield*/, randomSleep()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, fetchChineseDefinition(word)];
                case 6:
                    definitionZh = _a.sent();
                    return [4 /*yield*/, randomSleep()];
                case 7:
                    _a.sent();
                    if (!details.success) return [3 /*break*/, 12];
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, prisma.word.create({
                            data: {
                                id: "ielts-".concat(i + 1),
                                word: word,
                                phonetic: details.data.phonetic,
                                roots: '',
                                affixes: '',
                                etymology: '',
                                definitionEn: details.data.definitionEn || "Definition not found for \"".concat(word, "\""),
                                definitionZh: definitionZh || "\u6682\u65E0\u4E2D\u6587\u91CA\u4E49",
                                example: details.data.example || '',
                                lastReviewed: null,
                                nextReview: null,
                                reviewCount: 0,
                                known: false
                            }
                        })];
                case 9:
                    _a.sent();
                    // 每处理50个单词保存一次进度
                    if ((i + 1) % 50 === 0) {
                        saveProgress(i, words.length);
                        console.log("\u8FDB\u5EA6\u5DF2\u4FDD\u5B58: ".concat(i + 1, "/").concat(words.length));
                    }
                    return [3 /*break*/, 11];
                case 10:
                    error_3 = _a.sent();
                    console.error("Error saving word ".concat(word, ":"), error_3);
                    saveProgress(i, words.length);
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 13];
                case 12:
                    console.log("\u8DF3\u8FC7\u5355\u8BCD ".concat(word, " (\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25)"));
                    saveProgress(i, words.length);
                    _a.label = 13;
                case 13:
                    i++;
                    return [3 /*break*/, 3];
                case 14:
                    console.log('所有单词处理完成！');
                    return [3 /*break*/, 18];
                case 15:
                    error_4 = _a.sent();
                    console.error('发生错误:', error_4);
                    return [3 /*break*/, 18];
                case 16: return [4 /*yield*/, prisma.$disconnect()];
                case 17:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    });
}
// 启动爬虫
main().catch(console.error);
