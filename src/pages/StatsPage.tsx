
import React, { useMemo } from 'react';
import { useVocabulary } from '@/contexts/VocabularyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressChart from '@/components/stats/ProgressChart';
import StatCard from '@/components/stats/StatCard';
import { BarChart2, Clock, Download, Target } from 'lucide-react';

const StatsPage: React.FC = () => {
  const { words, status, exportData } = useVocabulary();
  const { t } = useLanguage();
  
  const generateWeekData = useMemo(() => {
    const weekData = [];
    const now = new Date();
    
    // Calculate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Count words learned on this day
      const learned = words.filter(word => {
        if (!word.lastReviewed) return false;
        const reviewDate = new Date(word.lastReviewed);
        return reviewDate >= dayStart && reviewDate <= dayEnd && word.known;
      }).length;
      
      // Count words reviewed on this day
      const reviewed = words.filter(word => {
        if (!word.lastReviewed) return false;
        const reviewDate = new Date(word.lastReviewed);
        return reviewDate >= dayStart && reviewDate <= dayEnd;
      }).length;
      
      weekData.push({
        name: dayName,
        learned,
        reviewed,
      });
    }
    
    return weekData;
  }, [words]);
  
  const accuracyRate = useMemo(() => {
    // Calculate overall accuracy based on review counts
    // This is a simplified calculation
    const knownWords = words.filter(word => word.known).length;
    return status.totalWords > 0 
      ? Math.round((knownWords / status.totalWords) * 100) 
      : 0;
  }, [words, status.totalWords]);
  
  const handleExportReport = () => {
    const data = exportData();
    
    // Create a blob and trigger download
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ielts-vocab-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('nav.stats')}</h1>
        <Button variant="outline" onClick={handleExportReport}>
          <Download size={18} className="mr-2" />
          {t('stats.export')}
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard
          title={t('stats.accuracy')}
          value={`${accuracyRate}%`}
          icon={<Target size={24} />}
        />
        <StatCard
          title={t('home.streak')}
          value={status.streak}
          icon={<Clock size={24} />}
          description={t('stats.daysInARow')}
        />
        <StatCard
          title={t('stats.wordsPerDay')}
          value={Math.round((status.learnedWords / Math.max(status.streak, 1)) * 10) / 10}
          icon={<BarChart2 size={24} />}
          description={t('stats.average')}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <ProgressChart 
          data={generateWeekData}
          title={t('stats.weekly')}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>{t('stats.overallProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span>{t('home.totalWords')}</span>
                <span className="font-bold">{status.totalWords}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('home.learned')}</span>
                <span className="font-bold">{status.learnedWords}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('stats.completion')}</span>
                <span className="font-bold">
                  {status.totalWords > 0 
                    ? `${Math.round((status.learnedWords / status.totalWords) * 100)}%` 
                    : '0%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('stats.averageReviews')}</span>
                <span className="font-bold">
                  {words.reduce((acc, word) => acc + (word.reviewCount || 0), 0) / Math.max(words.length, 1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsPage;
