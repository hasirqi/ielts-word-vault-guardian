
import React, { useState } from 'react';
import { Word } from '@/contexts/VocabularyContext';
import WordCardSide from './card/WordCardSide';

interface WordCardProps {
  word: Word;
  showAnswer?: boolean;
  onKnown?: () => void;
  onUnknown?: () => void;
  showButtons?: boolean;
  flip?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  showAnswer = false,
  onKnown,
  onUnknown,
  showButtons = true,
  flip = false,
}) => {
  const [flipped, setFlipped] = useState(showAnswer);

  const handleFlip = () => {
    if (!showAnswer) {
      setFlipped(prev => !prev);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto perspective-1000 ${flip ? 'flip-card-flip' : ''}`}>
      <div className="flip-card-inner relative w-full h-full">
        {/* Front Side */}
        <WordCardSide 
          word={word}
          isBackSide={false}
          showAnswer={showAnswer}
          showButtons={false}
          handleFlip={handleFlip}
        />
        
        {/* Back Side */}
        <WordCardSide 
          word={word}
          isBackSide={true}
          showAnswer={showAnswer || flipped}
          showButtons={showButtons}
          onKnown={onKnown}
          onUnknown={onUnknown}
          handleFlip={handleFlip}
        />
      </div>
    </div>
  );
};

export default WordCard;
