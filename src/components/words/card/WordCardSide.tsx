import React from 'react';
import { Word } from '@/contexts/VocabularyContext';
import WordImage from './WordImage';
import WordAudio from './WordAudio';
import WordDefinition from './WordDefinition';
import WordCardButtons from './WordCardButtons';
import { useLanguage } from '@/contexts/LanguageContext';

interface WordCardSideProps {
  word: Word;
  isBackSide: boolean;
  showAnswer: boolean;
  showButtons: boolean;
  onKnown?: () => void;
  onUnknown?: () => void;
  handleFlip: () => void;
}

const WordCardSide: React.FC<WordCardSideProps> = ({
  word,
  isBackSide,
  showAnswer,
  showButtons,
  onKnown,
  onUnknown,
  handleFlip
}) => {
  const { language } = useLanguage();
  const frontOrBackClass = isBackSide ? 'flip-card-back' : 'flip-card-front';
  const displayClass = (isBackSide && (showAnswer || isBackSide)) || (!isBackSide && !showAnswer) 
    ? 'block' 
    : 'hidden';
  
  const handleClick = () => {
    if (!showAnswer) {
      handleFlip();
    }
  };

  // 兼容 etymology 可能为 string 或对象
  let roots = '', affixes = '', explanation = '';
  if (word.etymology) {
    if (typeof word.etymology === 'object') {
      roots = word.etymology.roots || '';
      affixes = word.etymology.affixes || '';
      explanation = word.etymology.explanation || '';
    } else if (typeof word.etymology === 'string') {
      explanation = word.etymology;
    }
  }

  return (
    <div 
      className={`${frontOrBackClass} bg-card text-card-foreground rounded-lg shadow-md p-6 cursor-pointer ${displayClass}`}
      onClick={handleClick}
      style={{ marginLeft: '15px' }} // 向右移动卡片
    >
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-2" style={{ marginTop: '-20px' }}>{word.word}</h3>
        <p className="text-muted-foreground mb-2">{word.phonetic}</p>
        {(roots || affixes || explanation) && (
          <div className="text-sm border-t border-b border-gray-200 dark:border-gray-700 py-2 mb-3 mt-1">
            {roots && (
              <p className="text-left">
                <span className="font-medium">{language === 'en' ? 'Roots: ' : '词根：'}</span>
                <span className="text-amber-600 dark:text-amber-400">{roots}</span>
              </p>
            )}
            {affixes && (
              <p className="text-left">
                <span className="font-medium">{language === 'en' ? 'Affixes: ' : '词缀：'}</span>
                <span className="text-emerald-600 dark:text-emerald-400">{affixes}</span>
              </p>
            )}
            {explanation && (
              <p className="text-left text-gray-600 dark:text-gray-400 italic mt-1">
                {explanation}
              </p>
            )}
          </div>
        )}
        <div style={{ marginTop: '40px' }}>
          <WordImage word={word.word} />
        </div>
        
        {/* 新增：Learn模式下，单词下方显示音标、中文释义、词根、词缀 */}
        {!isBackSide && (
          <div className="mt-2 text-center text-base">
            {word.phonetic && (
              <div className="text-blue-700 dark:text-blue-300 font-medium mb-1">[{word.phonetic}]</div>
            )}
            {word.definitionZh && (
              <div className="text-gray-700 dark:text-gray-200 mb-1">{word.definitionZh}</div>
            )}
            
            {/* 显示词性和难度 */}
            <div className="flex flex-wrap justify-center gap-2 text-sm mt-1">
              {word.partOfSpeech && (
                <span className="bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-800 dark:text-blue-200">
                  {word.partOfSpeech}
                </span>
              )}
              {word.difficultyLevel && (
                <span className="bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded text-purple-800 dark:text-purple-200">
                  Level {word.difficultyLevel}
                </span>
              )}
              {word.frequency && (
                <span className="bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded text-orange-800 dark:text-orange-200">
                  Freq: {word.frequency}/10
                </span>
              )}
            </div>
            
            {/* 显示词根词缀 */}
            {(roots || affixes) && (
              <div className="flex flex-wrap justify-center gap-2 text-sm mt-1">
                {roots && <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded">词根: {roots}</span>}
                {affixes && <span className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">词缀: {affixes}</span>}
              </div>
            )}
            
            {/* 显示同义词反义词 */}
            {(word.synonyms || word.antonyms) && (
              <div className="text-xs mt-2 space-y-1">
                {word.synonyms && (
                  <div className="text-green-700 dark:text-green-300">
                    <span className="font-medium">同义词: </span>{word.synonyms}
                  </div>
                )}
                {word.antonyms && (
                  <div className="text-red-700 dark:text-red-300">
                    <span className="font-medium">反义词: </span>{word.antonyms}
                  </div>
                )}
              </div>
            )}
            
            {/* 显示记忆提示 */}
            {word.memoryTip && (
              <div className="text-xs mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border-l-4 border-amber-400">
                <span className="font-medium text-amber-800 dark:text-amber-200">💡 记忆提示: </span>
                <span className="text-amber-700 dark:text-amber-300">{word.memoryTip}</span>
              </div>
            )}
            
            {/* 显示分类 */}
            {word.category && (
              <div className="text-xs mt-1">
                <span className="bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 rounded text-indigo-800 dark:text-indigo-200">
                  📚 {word.category}
                </span>
              </div>
            )}
          </div>
        )}
        
        {!isBackSide && (
          <WordAudio word={word.word} />
        )}
        
        {isBackSide && (
          <>
            <WordDefinition word={word} />
            
            <div className="flex justify-center space-x-2 mt-2">
              <WordAudio word={word.word} variant="button" />
            </div>
            
            {showButtons && onKnown && onUnknown && (
              <WordCardButtons onKnown={onKnown} onUnknown={onUnknown} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WordCardSide;
