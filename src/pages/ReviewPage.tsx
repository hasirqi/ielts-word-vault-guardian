
import React, { useEffect, useState } from 'react';
import { useVocabulary, Word } from '@/contexts/VocabularyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WordCard from '@/components/words/WordCard';
import { useToast } from '@/hooks/use-toast';

type ReviewSection = 'today' | 'tomorrow' | 'upcoming';

const ReviewPage: React.FC = () => {
  const { words, reviewWord } = useVocabulary();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [section, setSection] = useState<ReviewSection>('today');
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  
  // Group words by review dates
  useEffect(() => {
    const now = Date.now();
    const tomorrow = now + 24 * 60 * 60 * 1000;
    const dayAfterTomorrow = now + 2 * 24 * 60 * 60 * 1000;
    
    let filtered: Word[] = [];
    
    if (section === 'today') {
      filtered = words.filter(word => 
        word.nextReview && word.nextReview <= now
      );
    } else if (section === 'tomorrow') {
      filtered = words.filter(word => 
        word.nextReview && word.nextReview > now && word.nextReview <= tomorrow
      );
    } else {
      filtered = words.filter(word => 
        word.nextReview && word.nextReview > tomorrow
      );
    }
    
    // Sort by review date
    filtered.sort((a, b) => {
      if (!a.nextReview || !b.nextReview) return 0;
      return a.nextReview - b.nextReview;
    });
    
    setReviewWords(filtered);
    setCurrentIndex(0);
    setReviewMode(false);
  }, [words, section]);
  
  const currentWord = reviewWords[currentIndex];
  
  const handleStartReview = () => {
    if (reviewWords.length > 0) {
      setReviewMode(true);
    } else {
      toast({
        title: t('common.error'),
        description: t('review.noWordsToReview'),
        variant: 'destructive',
      });
    }
  };
  
  const handleMarkSuccessful = () => {
    if (currentWord) {
      reviewWord(currentWord.id, true);
      handleNextWord();
    }
  };
  
  const handleMarkUnsuccessful = () => {
    if (currentWord) {
      reviewWord(currentWord.id, false);
      handleNextWord();
    }
  };
  
  const handleNextWord = () => {
    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setReviewMode(false);
      toast({
        title: t('common.success'),
        description: t('review.sessionCompleted'),
      });
    }
  };
  
  // Format date for display
  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="container mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('nav.review')}</h1>
        <p className="text-muted-foreground">{t('review.due')}</p>
      </div>
      
      {!reviewMode ? (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('review.due')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="today" value={section} onValueChange={(value) => setSection(value as ReviewSection)}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="today">{t('review.today')}</TabsTrigger>
                  <TabsTrigger value="tomorrow">{t('review.tomorrow')}</TabsTrigger>
                  <TabsTrigger value="upcoming">{t('review.upcoming')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today" className="mt-4">
                  {reviewWords.length > 0 ? (
                    <div className="space-y-2">
                      {reviewWords.map((word) => (
                        <div key={word.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">{word.word}</p>
                            <p className="text-sm text-muted-foreground">{word.phonetic}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4">{t('review.noWordsToReview')}</p>
                  )}
                </TabsContent>
                
                <TabsContent value="tomorrow" className="mt-4">
                  {reviewWords.length > 0 ? (
                    <div className="space-y-2">
                      {reviewWords.map((word) => (
                        <div key={word.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">{word.word}</p>
                            <p className="text-sm text-muted-foreground">{word.phonetic}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(word.nextReview)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4">{t('review.noWordsTomorrow')}</p>
                  )}
                </TabsContent>
                
                <TabsContent value="upcoming" className="mt-4">
                  {reviewWords.length > 0 ? (
                    <div className="space-y-2">
                      {reviewWords.map((word) => (
                        <div key={word.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">{word.word}</p>
                            <p className="text-sm text-muted-foreground">{word.phonetic}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(word.nextReview)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4">{t('review.noWordsUpcoming')}</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={reviewWords.length === 0 || section !== 'today'} 
                onClick={handleStartReview}
              >
                {t('review.startReview')}
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <span className="text-muted-foreground">
              {currentIndex + 1} / {reviewWords.length}
            </span>
          </div>
          
          {currentWord && (
            <>
              <WordCard word={currentWord} />
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handleMarkUnsuccessful}>
                  {t('learn.markAsUnknown')}
                </Button>
                <Button onClick={handleMarkSuccessful}>
                  {t('learn.markAsKnown')}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
