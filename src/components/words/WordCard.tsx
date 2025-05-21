
import React, { useState } from 'react';
import { Word } from '@/contexts/VocabularyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, Image } from 'lucide-react';

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
  const { language, t } = useLanguage();
  const [flipped, setFlipped] = useState(showAnswer);
  const [showExample, setShowExample] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Generate a consistent image for each word
  const generateImageUrl = (word: string) => {
    // Use Unsplash random images with the word as the search term
    // We're using a fixed size to ensure consistency
    // Using the word as query parameter ensures we get a related image
    const encodedWord = encodeURIComponent(word);
    return `https://source.unsplash.com/featured/300x200?${encodedWord}`;
  };

  const handleFlip = () => {
    if (!showAnswer) {
      setFlipped(prev => !prev);
    }
  };

  const playAudio = () => {
    // Using the Web Speech API for pronunciations
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className={`w-full max-w-md mx-auto perspective-1000 ${flip ? 'flip-card-flip' : ''}`}>
      <div className="flip-card-inner relative w-full h-full">
        <div 
          className={`flip-card-front bg-card text-card-foreground rounded-lg shadow-md p-6 cursor-pointer ${flipped ? 'hidden' : 'block'}`} 
          onClick={handleFlip}
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">{word.word}</h3>
            <p className="text-muted-foreground mb-4">{word.phonetic}</p>
            
            {/* Memory image */}
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
              {!imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  <img
                    src={generateImageUrl(word.word)}
                    alt={`Visual for ${word.word}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Image className="h-8 w-8 mb-2" />
                  <p className="text-sm">{t('common.imageNotAvailable')}</p>
                </div>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={(e) => { 
                e.stopPropagation();
                playAudio();
              }}
            >
              <Volume2 className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        <div 
          className={`flip-card-back bg-card text-card-foreground rounded-lg shadow-md p-6 ${flipped || showAnswer ? 'block' : 'hidden'}`}
          onClick={() => showAnswer ? null : handleFlip()}
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">{word.word}</h3>
            <p className="text-muted-foreground mb-4">{word.phonetic}</p>
            
            {/* Memory image */}
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
              {!imageError ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                  <img
                    src={generateImageUrl(word.word)}
                    alt={`Visual for ${word.word}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Image className="h-8 w-8 mb-2" />
                  <p className="text-sm">{t('common.imageNotAvailable')}</p>
                </div>
              )}
            </div>
            
            <div className="text-left mb-4">
              <h4 className="font-semibold">{language === 'en' ? 'Definition:' : '释义：'}</h4>
              <p className="mb-2">{word.definitions[language]}</p>
              
              {language === 'zh' && (
                <p className="text-muted-foreground text-sm">{word.definitions.en}</p>
              )}
              
              {showExample && (
                <div className="mt-4">
                  <h4 className="font-semibold">{language === 'en' ? 'Example:' : '例句：'}</h4>
                  <p className="italic">{word.example}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { 
                  e.stopPropagation();
                  playAudio();
                }}
              >
                <Volume2 className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Play' : '发音'}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => { 
                  e.stopPropagation();
                  setShowExample(prev => !prev);
                }}
              >
                {showExample 
                  ? (language === 'en' ? 'Hide Example' : '隐藏例句') 
                  : (language === 'en' ? 'Show Example' : '显示例句')}
              </Button>
            </div>
            
            {showButtons && onKnown && onUnknown && (
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  className="w-[48%]"
                  onClick={(e) => { 
                    e.stopPropagation();
                    onUnknown();
                  }}
                >
                  {t('learn.markAsUnknown')}
                </Button>
                <Button 
                  className="w-[48%]"
                  onClick={(e) => { 
                    e.stopPropagation();
                    onKnown();
                  }}
                >
                  {t('learn.markAsKnown')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
