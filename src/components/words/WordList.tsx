
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
      word.definitions[language].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder={t('vocab.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('vocab.word')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('vocab.phonetics')}</TableHead>
              <TableHead>{t('vocab.meaning')}</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWords.length > 0 ? (
              filteredWords.map((word) => (
                <TableRow key={word.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{word.word}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => playAudio(word.word)}
                        className="h-6 w-6"
                      >
                        <Volume2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{word.phonetic}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {word.definitions[language]}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(word)}>
                            <Edit size={14} className="mr-2" />
                            {t('vocab.edit')}
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(word.id)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            {t('vocab.delete')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {searchTerm ? `${t('common.error')}: ${t('common.noResults')}` : `${t('common.error')}: ${t('common.noWords')}`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WordList;
