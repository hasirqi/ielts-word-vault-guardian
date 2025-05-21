
import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface WordAudioProps {
  word: string;
  variant?: 'icon' | 'button';
  stopPropagation?: boolean;
}

const WordAudio: React.FC<WordAudioProps> = ({ 
  word, 
  variant = 'icon',
  stopPropagation = true
}) => {
  const { language } = useLanguage();
  
  const playAudio = (e?: React.MouseEvent) => {
    if (stopPropagation && e) {
      e.stopPropagation();
    }
    
    // Using the Web Speech API for pronunciations
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };
  
  if (variant === 'button') {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={(e) => playAudio(e)}
      >
        <Volume2 className="h-4 w-4 mr-1" />
        {language === 'en' ? 'Play' : '发音'}
      </Button>
    );
  }
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full"
      onClick={(e) => playAudio(e)}
    >
      <Volume2 className="h-6 w-6" />
    </Button>
  );
};

export default WordAudio;
