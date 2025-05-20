
import React, { useState, useEffect } from 'react';
import { useVocabulary, Word } from '@/contexts/VocabularyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import WordCard from '@/components/words/WordCard';
import { Shuffle, BookOpen, Edit, Volume2 } from 'lucide-react';

type StudyMode = 'sequential' | 'random' | 'spelling' | 'listening';
type WordSet = 'new' | 'review';

const LearnPage: React.FC = () => {
  const { words, markWordAsKnown } = useVocabulary();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<StudyMode>('sequential');
  const [wordSet, setWordSet] = useState<WordSet>('new');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyWords, setStudyWords] = useState<Word[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Get words to study based on selected set
  useEffect(() => {
    let filteredWords: Word[] = [];
    
    if (wordSet === 'new') {
      filteredWords = words.filter(word => !word.known);
    } else {
      filteredWords = words.filter(word => 
        word.known && word.nextReview && word.nextReview <= Date.now()
      );
    }
    
    if (mode === 'random') {
      filteredWords = [...filteredWords].sort(() => Math.random() - 0.5);
    }
    
    setStudyWords(filteredWords);
    setCurrentIndex(0);
    setUserAnswer('');
    setAnswered(false);
    setShowAnswer(false);
  }, [words, mode, wordSet]);
  
  const currentWord = studyWords[currentIndex];
  
  const handleNext = () => {
    if (currentIndex < studyWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setAnswered(false);
      setShowAnswer(false);
    } else {
      toast({
        title: t('common.success'),
        description: t('learn.completed'),
      });
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setUserAnswer('');
      setAnswered(false);
      setShowAnswer(false);
    }
  };
  
  const handleCheck = () => {
    if (!userAnswer.trim()) return;
    
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = currentWord.word.toLowerCase();
    
    setIsCorrect(normalizedUserAnswer === normalizedCorrectAnswer);
    setAnswered(true);
  };
  
  const handleMarkAsKnown = () => {
    if (currentWord) {
      markWordAsKnown(currentWord.id, true);
      toast({
        title: t('common.success'),
        description: t('learn.wordMarkedAsKnown'),
      });
      handleNext();
    }
  };
  
  const handleMarkAsUnknown = () => {
    if (currentWord) {
      markWordAsKnown(currentWord.id, false);
      toast({
        title: t('common.success'),
        description: t('learn.wordMarkedAsUnknown'),
      });
      handleNext();
    }
  };
  
  const playAudio = () => {
    if (!currentWord) return;
    
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };
  
  return (
    <div className="container mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('learn.title')}</h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('learn.title')}</CardTitle>
          <CardDescription>
            {t('learn.selectMode')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Tabs value={mode} onValueChange={(value) => setMode(value as StudyMode)}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="sequential">
                  <BookOpen size={16} className="mr-2" />
                  {t('learn.sequential')}
                </TabsTrigger>
                <TabsTrigger value="random">
                  <Shuffle size={16} className="mr-2" />
                  {t('learn.random')}
                </TabsTrigger>
                <TabsTrigger value="spelling">
                  <Edit size={16} className="mr-2" />
                  {t('learn.spelling')}
                </TabsTrigger>
                <TabsTrigger value="listening">
                  <Volume2 size={16} className="mr-2" />
                  {t('learn.listening')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Tabs value={wordSet} onValueChange={(value) => setWordSet(value as WordSet)}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="new">{t('learn.newWords')}</TabsTrigger>
                <TabsTrigger value="review">{t('learn.reviewWords')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {studyWords.length > 0 ? (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-muted-foreground">
              {currentIndex + 1} / {studyWords.length}
            </span>
          </div>
          
          {currentWord && (
            <>
              {(mode === 'sequential' || mode === 'random') && (
                <WordCard
                  word={currentWord}
                  onKnown={handleMarkAsKnown}
                  onUnknown={handleMarkAsUnknown}
                />
              )}
              
              {mode === 'spelling' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{currentWord.definitions[wordSet === 'new' ? 'zh' : 'en']}</CardTitle>
                    {wordSet === 'new' && (
                      <CardDescription>{currentWord.definitions.en}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input
                        placeholder={t('learn.typeWord')}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !answered) handleCheck();
                        }}
                        disabled={answered}
                      />
                      
                      {answered && (
                        <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                          <p className="font-bold">
                            {isCorrect ? t('learn.correct') : t('learn.incorrect')}
                          </p>
                          <p>
                            {t('common.correctAnswer')}: <span className="font-bold">{currentWord.word}</span>
                          </p>
                        </div>
                      )}
                      
                      {showAnswer && <WordCard word={currentWord} showAnswer showButtons={false} />}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div>
                      <Button variant="outline" onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? t('learn.hideAnswer') : t('learn.showAnswer')}
                      </Button>
                    </div>
                    <div className="space-x-2">
                      {!answered ? (
                        <Button onClick={handleCheck}>{t('learn.check')}</Button>
                      ) : (
                        <Button onClick={handleNext}>{t('learn.next')}</Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              )}
              
              {mode === 'listening' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('learn.listening')}</CardTitle>
                    <CardDescription>
                      {t('learn.listenAndType')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-full h-16 w-16"
                          onClick={playAudio}
                        >
                          <Volume2 size={24} />
                        </Button>
                      </div>
                      
                      <Input
                        placeholder={t('learn.typeHeard')}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !answered) handleCheck();
                        }}
                        disabled={answered}
                      />
                      
                      {answered && (
                        <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                          <p className="font-bold">
                            {isCorrect ? t('learn.correct') : t('learn.incorrect')}
                          </p>
                          <p>
                            {t('common.correctAnswer')}: <span className="font-bold">{currentWord.word}</span>
                          </p>
                        </div>
                      )}
                      
                      {showAnswer && <WordCard word={currentWord} showAnswer showButtons={false} />}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div>
                      <Button variant="outline" onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? t('learn.hideAnswer') : t('learn.showAnswer')}
                      </Button>
                    </div>
                    <div className="space-x-2">
                      {!answered ? (
                        <Button onClick={handleCheck}>{t('learn.check')}</Button>
                      ) : (
                        <Button onClick={handleNext}>{t('learn.next')}</Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
          
          {(mode === 'sequential' || mode === 'random') && (
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
                {t('learn.previous')}
              </Button>
              <Button onClick={handleNext} disabled={currentIndex === studyWords.length - 1}>
                {t('learn.next')}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p>{wordSet === 'new' ? t('learn.noNewWords') : t('learn.noReviewWords')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearnPage;
