"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.useVocabulary = exports.VocabularyProvider = void 0;
var react_1 = __importStar(require("react"));
var ieltsWordList_1 = require("@/data/ieltsWordList");
var api_1 = require("@/lib/api");
// Ebbinghaus forgetting curve intervals in hours
var reviewIntervals = [1, 24, 72, 168, 336, 672, 1344];
var VocabularyContext = (0, react_1.createContext)(undefined);
var VocabularyProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), words = _b[0], setWords = _b[1];
    var _c = (0, react_1.useState)(function () { return ({
        totalWords: 0,
        learnedWords: 0,
        toReviewToday: 0,
        dailyGoal: 10,
        streak: 0,
        lastStudyDate: null
    }); }), status = _c[0], setStatus = _c[1];
    // Load words from database on mount, 自动导入
    (0, react_1.useEffect)(function () {
        var loadWords = function () { return __awaiter(void 0, void 0, void 0, function () {
            var dbWords, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbWords = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, api_1.getWords)()];
                    case 2:
                        dbWords = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error('getWords failed, fallback to local list', e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        if (!dbWords || dbWords.length === 0) {
                            // fallback: 使用大词库
                            dbWords = ieltsWordList_1.ieltsWordList;
                            // 提示用户后端未启动或数据库无数据
                            if (typeof window !== 'undefined') {
                                window.alert('后端API未启动或数据库无数据，已使用大词库。请检查后端服务！');
                            }
                        }
                        setWords(dbWords);
                        setStatus(function (prev) { return (__assign(__assign({}, prev), { totalWords: dbWords.length, learnedWords: dbWords.filter(function (w) { return w.known; }).length })); });
                        return [2 /*return*/];
                }
            });
        }); };
        loadWords();
    }, []);
    // Calculate the next review time based on the review count
    var calculateNextReview = function (reviewCount) {
        var interval = reviewCount >= reviewIntervals.length
            ? reviewIntervals[reviewIntervals.length - 1]
            : reviewIntervals[reviewCount];
        return Date.now() + interval * 60 * 60 * 1000; // Convert hours to milliseconds
    };
    // Update stats daily
    (0, react_1.useEffect)(function () {
        var updateDailyStats = function () {
            var now = Date.now();
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var todayTimestamp = today.getTime();
            // Count words due for review today
            var toReviewToday = words.filter(function (word) {
                return word.nextReview && word.nextReview <= todayTimestamp + 24 * 60 * 60 * 1000;
            }).length;
            // Check streak
            var streak = status.streak;
            var lastStudyDate = status.lastStudyDate;
            if (lastStudyDate) {
                var yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday.setHours(0, 0, 0, 0);
                // If last study was before yesterday, reset streak
                if (lastStudyDate < yesterday.getTime()) {
                    streak = 0;
                }
            }
            setStatus(function (prev) { return (__assign(__assign({}, prev), { toReviewToday: toReviewToday, streak: streak })); });
        };
        updateDailyStats();
        // Set up daily update
        var today = new Date();
        today.setHours(24, 0, 0, 0); // Set to midnight
        var timeToMidnight = today.getTime() - Date.now();
        var timer = setTimeout(updateDailyStats, timeToMidnight);
        return function () { return clearTimeout(timer); };
    }, [words, status.streak, status.lastStudyDate]);
    var addWord = function (newWord) {
        var word = __assign(__assign({ id: "custom-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9)) }, newWord), { lastReviewed: null, nextReview: null, reviewCount: 0, known: false });
        setWords(function (prev) { return __spreadArray(__spreadArray([], prev, true), [word], false); });
        setStatus(function (prev) { return (__assign(__assign({}, prev), { totalWords: prev.totalWords + 1 })); });
    };
    var updateWord = function (updatedWord) {
        setWords(function (prev) { return prev.map(function (word) {
            return word.id === updatedWord.id ? updatedWord : word;
        }); });
    };
    var deleteWord = function (id) {
        setWords(function (prev) { return prev.filter(function (word) { return word.id !== id; }); });
        setStatus(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { totalWords: prev.totalWords - 1, learnedWords: prev.learnedWords - (((_a = words.find(function (w) { return w.id === id; })) === null || _a === void 0 ? void 0 : _a.known) ? 1 : 0) }));
        });
    };
    var markWordAsKnown = function (id, known) {
        setWords(function (prev) { return prev.map(function (word) {
            if (word.id === id) {
                return __assign(__assign({}, word), { known: known, lastReviewed: known ? Date.now() : word.lastReviewed, nextReview: known ? calculateNextReview(0) : word.nextReview, reviewCount: known ? 1 : word.reviewCount });
            }
            return word;
        }); });
        setStatus(function (prev) {
            // Update learning status
            var now = Date.now();
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var todayTimestamp = today.getTime();
            // Check if we should increment streak
            var newStreak = prev.streak;
            if (prev.lastStudyDate === null || prev.lastStudyDate < todayTimestamp) {
                newStreak += 1;
            }
            return __assign(__assign({}, prev), { learnedWords: known
                    ? prev.learnedWords + 1
                    : Math.max(0, prev.learnedWords - 1), lastStudyDate: now, streak: newStreak });
        });
    };
    var reviewWord = function (id, successful) {
        setWords(function (prev) { return prev.map(function (word) {
            if (word.id === id) {
                var newReviewCount = successful
                    ? Math.min((word.reviewCount || 0) + 1, reviewIntervals.length)
                    : Math.max((word.reviewCount || 0) - 1, 0);
                return __assign(__assign({}, word), { lastReviewed: Date.now(), nextReview: calculateNextReview(newReviewCount), reviewCount: newReviewCount, known: true });
            }
            return word;
        }); });
        // Update learning status
        var now = Date.now();
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var todayTimestamp = today.getTime();
        setStatus(function (prev) {
            var _a;
            // Check if we should increment streak
            var newStreak = prev.streak;
            if (prev.lastStudyDate === null || prev.lastStudyDate < todayTimestamp) {
                newStreak += 1;
            }
            return __assign(__assign({}, prev), { learnedWords: successful && ((_a = words.find(function (w) { return w.id === id; })) === null || _a === void 0 ? void 0 : _a.known) === false
                    ? prev.learnedWords + 1
                    : prev.learnedWords, lastStudyDate: now, streak: newStreak });
        });
    };
    var getWordsToReview = function () {
        var now = Date.now();
        return words.filter(function (word) { return word.nextReview && word.nextReview <= now; });
    };
    var resetProgress = function () { return __awaiter(void 0, void 0, void 0, function () {
        var dbWords;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.clearWords)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, api_1.importLocalWords)()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, api_1.getWords)()];
                case 3:
                    dbWords = _a.sent();
                    setWords(dbWords);
                    setStatus({
                        totalWords: dbWords.length,
                        learnedWords: 0,
                        toReviewToday: 0,
                        dailyGoal: 10,
                        streak: 0,
                        lastStudyDate: null
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var exportData = function () {
        return JSON.stringify({
            words: words,
            status: status
        });
    };
    var importData = function (data) {
        try {
            var parsedData = JSON.parse(data);
            if (parsedData.words && parsedData.status) {
                setWords(parsedData.words);
                setStatus(parsedData.status);
                return true;
            }
            return false;
        }
        catch (e) {
            console.error('Failed to import data:', e);
            return false;
        }
    };
    var updateDailyGoal = function (goal) {
        setStatus(function (prev) { return (__assign(__assign({}, prev), { dailyGoal: goal })); });
    };
    return (react_1.default.createElement(VocabularyContext.Provider, { value: {
            words: words,
            status: status,
            addWord: addWord,
            updateWord: updateWord,
            deleteWord: deleteWord,
            markWordAsKnown: markWordAsKnown,
            reviewWord: reviewWord,
            getWordsToReview: getWordsToReview,
            resetProgress: resetProgress,
            exportData: exportData,
            importData: importData,
            updateDailyGoal: updateDailyGoal
        } }, children));
};
exports.VocabularyProvider = VocabularyProvider;
var useVocabulary = function () {
    var context = (0, react_1.useContext)(VocabularyContext);
    if (!context) {
        throw new Error('useVocabulary must be used within a VocabularyProvider');
    }
    return context;
};
exports.useVocabulary = useVocabulary;
