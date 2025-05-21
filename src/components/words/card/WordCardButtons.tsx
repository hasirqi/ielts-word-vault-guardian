
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface WordCardButtonsProps {
  onKnown: () => void;
  onUnknown: () => void;
}

const WordCardButtons: React.FC<WordCardButtonsProps> = ({ onKnown, onUnknown }) => {
  const { t } = useLanguage();
  
  return (
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
  );
};

export default WordCardButtons;
