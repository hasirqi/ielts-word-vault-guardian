
import React, { useState } from 'react';
import { useVocabulary, Word } from '@/contexts/VocabularyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import WordList from '@/components/words/WordList';
import AddWordDialog from '@/components/words/AddWordDialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VocabularyPage: React.FC = () => {
  const { words, addWord, updateWord, deleteWord } = useVocabulary();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  
  const handleAddWord = (data: {
    word: string;
    phonetic: string;
    definitions: { en: string; zh: string };
    example: string;
  }) => {
    addWord(data);
    toast({
      title: t('common.success'),
      description: t('vocab.wordAdded'),
    });
  };
  
  const handleEditWord = (word: Word) => {
    setCurrentWord(word);
    setEditDialogOpen(true);
  };
  
  const handleUpdateWord = (data: {
    word: string;
    phonetic: string;
    definitions: { en: string; zh: string };
    example: string;
  }) => {
    if (currentWord) {
      updateWord({
        ...currentWord,
        word: data.word,
        phonetic: data.phonetic,
        definitions: data.definitions,
        example: data.example,
      });
      toast({
        title: t('common.success'),
        description: t('vocab.wordUpdated'),
      });
    }
  };
  
  const handleDeletePrompt = (id: string) => {
    const word = words.find(w => w.id === id);
    if (word) {
      setCurrentWord(word);
      setDeleteDialogOpen(true);
    }
  };
  
  const handleConfirmDelete = () => {
    if (currentWord) {
      deleteWord(currentWord.id);
      toast({
        title: t('common.success'),
        description: t('vocab.wordDeleted'),
      });
      setDeleteDialogOpen(false);
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('nav.vocabulary')}</h1>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus size={18} className="mr-2" />
          {t('vocab.add')}
        </Button>
      </div>
      
      <WordList
        words={words}
        onEdit={handleEditWord}
        onDelete={handleDeletePrompt}
      />
      
      <AddWordDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddWord}
      />
      
      <AddWordDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateWord}
        initialWord={currentWord || undefined}
      />
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.confirm')}</DialogTitle>
            <DialogDescription>
              {t('vocab.deleteConfirm')}
              {currentWord && <span className="font-bold block mt-2">{currentWord.word}</span>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VocabularyPage;
