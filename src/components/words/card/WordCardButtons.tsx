
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, XCircle } from 'lucide-react';

interface WordCardButtonsProps {
  onKnown: () => void;
  onUnknown: () => void;
}

const WordCardButtons: React.FC<WordCardButtonsProps> = ({ onKnown, onUnknown }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between mt-6 gap-3">
      <Button 
        variant="outline" 
        className="w-[48%] flex items-center justify-center border-red-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/20 dark:border-red-700 dark:text-red-300"
        onClick={(e) => { 
          e.stopPropagation();
          onUnknown();
        }}
      >
        <XCircle className="h-4 w-4 mr-2" />
        {t('learn.markAsUnknown')}
      </Button>
      <Button 
        className="w-[48%] flex items-center justify-center bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 dark:text-white"
        onClick={(e) => { 
          e.stopPropagation();
          onKnown();
        }}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        {t('learn.markAsKnown')}
      </Button>
    </div>
  );
};

export default WordCardButtons;
