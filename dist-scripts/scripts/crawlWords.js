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
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var prisma = new client_1.PrismaClient();
// 防止被封禁，添加随机延迟
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var randomSleep = function () { return sleep(Math.random() * 2000 + 1000); };
// 从 Free Dictionary API 获取单词详细信息
function fetchWordDetails(word) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data, phonetic, phoneticData, definitionEn, example, partOfSpeech, roots, affixes, meaning, def, i, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://api.dictionaryapi.dev/api/v2/entries/en/".concat(encodeURIComponent(word));
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    response = _a.sent();
                    data = response.data[0];
                    phonetic = data.phonetic || '';
                    if (!phonetic && data.phonetics && data.phonetics.length > 0) {
                        phoneticData = data.phonetics.find(function (p) { return p.text; }) || data.phonetics[0];
                        phonetic = (phoneticData === null || phoneticData === void 0 ? void 0 : phoneticData.text) || '';
                    }
                    definitionEn = '';
                    example = '';
                    partOfSpeech = '';
                    roots = '';
                    affixes = '';
                    if (data.meanings && data.meanings.length > 0) {
                        meaning = data.meanings[0];
                        partOfSpeech = meaning.partOfSpeech || '';
                        if (meaning.definitions && meaning.definitions.length > 0) {
                            def = meaning.definitions[0];
                            definitionEn = def.definition || '';
                            example = def.example || '';
                            // 如果第一个定义没有例句，尝试从其他定义中找
                            if (!example) {
                                for (i = 1; i < meaning.definitions.length; i++) {
                                    if (meaning.definitions[i].example) {
                                        example = meaning.definitions[i].example;
                                        break;
                                    }
                                }
                            }
                        }
                        // 模拟提取词根和词缀（实际需要更复杂的逻辑或数据源）
                        roots = "Root of ".concat(word);
                        affixes = "Affixes of ".concat(word);
                    }
                    return [4 /*yield*/, randomSleep()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            phonetic: "/".concat(phonetic, "/"),
                            definitionEn: definitionEn,
                            example: example,
                            roots: roots,
                            affixes: affixes
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching details for word: ".concat(word), error_1.message);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 从有道词典获取中文释义
function fetchChineseDefinition(word) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, $, definitionZh, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    url = "https://dict.youdao.com/w/".concat(encodeURIComponent(word));
                    return [4 /*yield*/, axios_1.default.get(url, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                            }
                        })];
                case 1:
                    response = _a.sent();
                    $ = cheerio.load(response.data);
                    definitionZh = $('#phrsListTab .trans-container ul li').first().text() || '';
                    return [4 /*yield*/, randomSleep()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, definitionZh];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error fetching Chinese definition for word: ".concat(word), error_2.message);
                    return [2 /*return*/, ''];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 读取核心词汇列表
function readWordList() {
    return __awaiter(this, void 0, void 0, function () {
        var wordListPath, content;
        return __generator(this, function (_a) {
            wordListPath = path.join(__dirname, 'ielts_core_words.txt');
            if (!fs.existsSync(wordListPath)) {
                throw new Error('Word list file not found!');
            }
            content = fs.readFileSync(wordListPath, 'utf-8');
            return [2 /*return*/, content.split('\n').map(function (word) { return word.trim(); }).filter(function (word) { return word; })];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var words, i, word, details, definitionZh, error_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 13, 14, 16]);
                    console.log('开始爬取词汇数据...');
                    return [4 /*yield*/, readWordList()];
                case 1:
                    words = _a.sent();
                    console.log("\u603B\u5171\u8BFB\u53D6\u5230 ".concat(words.length, " \u4E2A\u5355\u8BCD"));
                    // 清空现有数据库
                    return [4 /*yield*/, prisma.word.deleteMany()];
                case 2:
                    // 清空现有数据库
                    _a.sent();
                    console.log('数据库已清空，准备导入新数据');
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < words.length)) return [3 /*break*/, 12];
                    word = words[i];
                    console.log("\u5904\u7406\u7B2C ".concat(i + 1, "/").concat(words.length, " \u4E2A\u5355\u8BCD: ").concat(word));
                    return [4 /*yield*/, fetchWordDetails(word)];
                case 4:
                    details = _a.sent();
                    return [4 /*yield*/, fetchChineseDefinition(word)];
                case 5:
                    definitionZh = _a.sent();
                    if (!details) return [3 /*break*/, 9];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, prisma.word.create({
                            data: {
                                id: "ielts-".concat(i + 1),
                                word: word,
                                phonetic: details.phonetic || '',
                                roots: details.roots || '', // 词根信息
                                affixes: details.affixes || '', // 词缀信息
                                etymology: '', // 词源信息需要其他来源
                                definitionEn: details.definitionEn || "Definition for \"".concat(word, "\" not found"),
                                definitionZh: definitionZh || "\u6682\u65E0\u4E2D\u6587\u91CA\u4E49",
                                example: details.example || '',
                                lastReviewed: null,
                                nextReview: null,
                                reviewCount: 0,
                                known: false
                            }
                        })];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_3 = _a.sent();
                    console.error("\u4FDD\u5B58\u5355\u8BCD ".concat(word, " \u65F6\u51FA\u9519:"), error_3);
                    return [3 /*break*/, 9];
                case 9: 
                // 防止请求过快
                return [4 /*yield*/, randomSleep()];
                case 10:
                    // 防止请求过快
                    _a.sent();
                    _a.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 3];
                case 12:
                    console.log('单词爬取和导入完成！');
                    return [3 /*break*/, 16];
                case 13:
                    error_4 = _a.sent();
                    console.error('发生错误:', error_4);
                    process.exit(1);
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, prisma.$disconnect()];
                case 15:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
}
main();
