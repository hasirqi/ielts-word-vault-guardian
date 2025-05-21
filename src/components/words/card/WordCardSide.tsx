
import React from 'react';
import { Word } from '@/contexts/VocabularyContext';
import WordImage from './WordImage';
import WordAudio from './WordAudio';
import WordDefinition from './WordDefinition';
import WordCardButtons from './WordCardButtons';

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
        <p className="text-muted-foreground mb-4">{word.phonetic}</p>
        
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
