
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StatCard from '@/components/stats/StatCard';
import { BookOpen, Clock, Target, Flame } from 'lucide-react';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { status, words } = useVocabulary();
  const navigate = useNavigate();
  
  const learningProgress = Math.round((status.learnedWords / status.totalWords) * 100) || 0;
  const wordsToReview = words.filter(word => 
    word.nextReview && word.nextReview <= Date.now()
  ).length;
  
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t('home.title')}</h1>
        <p className="text-muted-foreground">{t('home.subtitle')}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title={t('home.totalWords')}
          value={status.totalWords}
          icon={<BookOpen size={24} />}
        />
        <StatCard
          title={t('home.learned')}
          value={status.learnedWords}
          icon={<BookOpen size={24} />}
          description={`${learningProgress}% ${t('common.complete')}`}
        />
        <StatCard
          title={t('home.toReview')}
          value={wordsToReview}
          icon={<Clock size={24} />}
        />
        <StatCard
          title={t('home.streak')}
          value={status.streak}
          icon={<Flame size={24} />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('home.dailyGoal')}</CardTitle>
            <CardDescription>
              {status.learnedWords} / {status.dailyGoal} {t('common.wordsToday')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={(status.learnedWords / status.dailyGoal) * 100} 
              className="h-3" 
            />
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => navigate('/learn')}
            >
              {t('home.startStudy')}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('nav.vocabulary')}</CardTitle>
            <CardDescription>
              {status.learnedWords} / {status.totalWords} {t('common.wordsLearned')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress 
              value={learningProgress} 
              className="h-3" 
            />
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => navigate('/vocabulary')}
            >
              {t('home.viewVocab')}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="flex justify-center space-x-4">
        <Button size="lg" onClick={() => navigate('/learn')}>
          {t('home.startStudy')}
        </Button>
        {wordsToReview > 0 && (
          <Button variant="outline" size="lg" onClick={() => navigate('/review')}>
            {t('review.startReview')} ({wordsToReview})
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
