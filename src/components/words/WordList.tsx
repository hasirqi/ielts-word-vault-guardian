import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Word } from '@/contexts/VocabularyContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreHorizontal, Search, Trash2, Volume2 } from 'lucide-react';

interface WordListProps {
  words: Word[];
  onEdit?: (word: Word) => void;
  onDelete?: (id: string) => void;
}

const WordList: React.FC<WordListProps> = ({ words, onEdit, onDelete }) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = words.filter(
    word => 
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definitionEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definitionZh.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder={t('vocab.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {t('vocab.totalWords')}: {words.length}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">{t('vocab.word')}</TableHead>
              <TableHead>{t('vocab.phonetic')}</TableHead>
              <TableHead>{t('vocab.definitionEn')}</TableHead>
              <TableHead>{t('vocab.definitionZh')}</TableHead>
              <TableHead>{t('vocab.example')}</TableHead>
              <TableHead className="w-[100px]">{t('vocab.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWords.map(word => (
              <TableRow key={word.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <span>{word.word}</span>
                    <Button variant="ghost" size="icon" onClick={() => playAudio(word.word)}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{word.phonetic}</TableCell>
                <TableCell>{word.definitionEn}</TableCell>
                <TableCell>{word.definitionZh}</TableCell>
                <TableCell>{word.example}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(word)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(word.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WordList;
