
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

  return (
    <div 
      className={`${frontOrBackClass} bg-card text-card-foreground rounded-lg shadow-md p-6 cursor-pointer ${displayClass}`} 
      onClick={handleClick}
    >
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-2">{word.word}</h3>
        <p className="text-muted-foreground mb-2">{word.phonetic}</p>
        
        {word.etymology && (
          <div className="text-sm border-t border-b border-gray-200 dark:border-gray-700 py-2 mb-3 mt-1">
            {word.etymology.roots && (
              <p className="text-left">
                <span className="font-medium">{language === 'en' ? 'Roots: ' : '词根：'}</span>
                <span className="text-amber-600 dark:text-amber-400">{word.etymology.roots}</span>
              </p>
            )}
            {word.etymology.affixes && (
              <p className="text-left">
                <span className="font-medium">{language === 'en' ? 'Affixes: ' : '词缀：'}</span>
                <span className="text-emerald-600 dark:text-emerald-400">{word.etymology.affixes}</span>
              </p>
            )}
            {word.etymology.explanation && (
              <p className="text-left text-gray-600 dark:text-gray-400 italic mt-1">
                {word.etymology.explanation}
              </p>
            )}
          </div>
        )}
        
        <WordImage word={word.word} />
        
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
