
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Word } from '@/contexts/VocabularyContext';

interface WordDefinitionProps {
  word: Word;
}

const WordDefinition: React.FC<WordDefinitionProps> = ({ word }) => {
  const { language, t } = useLanguage();
  const [showExample, setShowExample] = useState(false);
  
  // 兼容新旧数据结构
  const getDefinition = (lang: 'en' | 'zh') => {
    if (word.definitions && typeof word.definitions === 'object') {
      return word.definitions[lang];
    }
    // 兼容旧结构
    return lang === 'en' ? word.definitionEn : word.definitionZh;
  };
  
  return (
    <div className="text-left mb-4">
      <h4 className="font-semibold">{language === 'en' ? 'Definition:' : '释义：'}</h4>
      <p className="mb-2">{getDefinition(language)}</p>
      
      {language === 'zh' && (
        <p className="text-muted-foreground text-sm">{getDefinition('en')}</p>
      )}
      
      {showExample && (
        <div className="mt-4">
          <h4 className="font-semibold">{language === 'en' ? 'Example:' : '例句：'}</h4>
          <p className="italic">{word.example}</p>
        </div>
      )}
      
      <div className="flex justify-center space-x-2 mt-2">
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
    </div>
  );
};

export default WordDefinition;
