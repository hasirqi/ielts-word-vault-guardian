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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var categories = {
    academic: [
        'dissertation', 'methodology', 'synthesis', 'hypothesis', 'empirical',
        'thesis', 'abstract', 'analysis', 'research', 'interpretation',
        'evaluation', 'critique', 'framework', 'validity', 'reliability',
        'citation', 'reference', 'publication', 'journal', 'theoretical'
    ],
    environment: [
        'biodiversity', 'ecosystem', 'sustainability', 'conservation', 'renewable',
        'pollution', 'climate', 'extinction', 'habitat', 'organic',
        'environmental', 'ecological', 'greenhouse', 'emissions', 'deforestation',
        'recycling', 'preservation', 'contamination', 'atmosphere', 'ozone'
    ],
    technology: [
        'algorithm', 'artificial', 'automation', 'biotechnology', 'cybersecurity',
        'digital', 'encryption', 'innovation', 'nanotechnology', 'quantum',
        'semiconductor', 'interface', 'database', 'protocol', 'bandwidth',
        'authentication', 'blockchain', 'infrastructure', 'integration', 'robotics'
    ],
    business: [
        'entrepreneur', 'investment', 'corporation', 'stakeholder', 'portfolio',
        'dividend', 'revenue', 'liability', 'assets', 'subsidiary',
        'merger', 'acquisition', 'leverage', 'benchmark', 'compliance',
        'outsourcing', 'logistics', 'procurement', 'scalability', 'diversification'
    ],
    health: [
        'immunity', 'diagnosis', 'pathology', 'therapeutic', 'syndrome',
        'cardiovascular', 'vaccination', 'metabolism', 'nutrients', 'genetics',
        'neurology', 'endocrine', 'respiratory', 'physiological', 'antibodies',
        'epidemiology', 'immunology', 'pharmaceutical', 'psychological', 'rehabilitation'
    ]
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var currentPath, backupPath, content, currentWords_1, added_1, sortedWords;
        return __generator(this, function (_a) {
            try {
                currentPath = path_1.default.join(__dirname, 'ielts_core_words.txt');
                backupPath = path_1.default.join(__dirname, "ielts_core_words_".concat(Date.now(), ".txt"));
                content = fs_1.default.readFileSync(currentPath, 'utf-8');
                currentWords_1 = new Set(content.split('\n').map(function (w) { return w.trim(); }).filter(Boolean));
                // 备份当前文件
                fs_1.default.copyFileSync(currentPath, backupPath);
                console.log("\u5F53\u524D\u8BCD\u6C47\u91CF: ".concat(currentWords_1.size));
                added_1 = 0;
                Object.values(categories).flat().forEach(function (word) {
                    if (!currentWords_1.has(word)) {
                        currentWords_1.add(word);
                        added_1++;
                    }
                });
                sortedWords = Array.from(currentWords_1).sort();
                fs_1.default.writeFileSync(currentPath, sortedWords.join('\n'));
                console.log("\u65B0\u589E\u8BCD\u6C47: ".concat(added_1));
                console.log("\u66F4\u65B0\u540E\u603B\u8BCD\u6C47\u91CF: ".concat(currentWords_1.size));
                console.log('词汇列表已更新并备份');
            }
            catch (error) {
                console.error('Error:', error);
            }
            return [2 /*return*/];
        });
    });
}
main();
