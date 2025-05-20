
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Word } from '@/contexts/VocabularyContext';

const formSchema = z.object({
  word: z.string().min(1, { message: "Word is required" }),
  phonetic: z.string().min(1, { message: "Phonetic is required" }),
  definitionEn: z.string().min(1, { message: "English definition is required" }),
  definitionZh: z.string().min(1, { message: "Chinese definition is required" }),
  example: z.string().min(1, { message: "Example is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    word: string;
    phonetic: string;
    definitions: { en: string; zh: string };
    example: string;
  }) => void;
  initialWord?: Word;
}

const AddWordDialog: React.FC<AddWordDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialWord,
}) => {
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialWord
      ? {
          word: initialWord.word,
          phonetic: initialWord.phonetic,
          definitionEn: initialWord.definitions.en,
          definitionZh: initialWord.definitions.zh,
          example: initialWord.example,
        }
      : {
          word: '',
          phonetic: '',
          definitionEn: '',
          definitionZh: '',
          example: '',
        },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit({
      word: data.word,
      phonetic: data.phonetic,
      definitions: {
        en: data.definitionEn,
        zh: data.definitionZh,
      },
      example: data.example,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialWord ? t('vocab.editWord') : t('vocab.addNew')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vocab.word')}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., abandon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phonetic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vocab.phonetics')}</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., /əˈbændən/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="definitionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Definition</FormLabel>
                  <FormControl>
                    <Textarea placeholder="English definition" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="definitionZh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chinese Definition (中文释义)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="中文释义" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example Sentence</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Example sentence using this word" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {initialWord ? t('common.save') : t('common.add')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWordDialog;
