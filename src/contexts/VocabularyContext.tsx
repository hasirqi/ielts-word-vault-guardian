
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ieltsWordList } from '@/data/ieltsWordList';

// Define Word type
export type Word = {
  id: string;
  word: string;
  phonetic: string;
  definitions: {
    en: string;
    zh: string;
  };
  example: string;
  lastReviewed: number | null;
  nextReview: number | null;
  reviewCount: number;
  known: boolean;
};

// Define the learning status
export type LearningStatus = {
  totalWords: number;
  learnedWords: number;
  toReviewToday: number;
  dailyGoal: number;
  streak: number;
  lastStudyDate: number | null;
};

type VocabularyContextType = {
  words: Word[];
  status: LearningStatus;
  addWord: (word: Omit<Word, 'id' | 'lastReviewed' | 'nextReview' | 'reviewCount' | 'known'>) => void;
  updateWord: (word: Word) => void;
  deleteWord: (id: string) => void;
  markWordAsKnown: (id: string, known: boolean) => void;
  reviewWord: (id: string, successful: boolean) => void;
  getWordsToReview: () => Word[];
  resetProgress: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  updateDailyGoal: (goal: number) => void;
};

// Ebbinghaus forgetting curve intervals in hours
const reviewIntervals = [1, 24, 72, 168, 336, 672, 1344];

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with data from localStorage or default data
  const [words, setWords] = useState<Word[]>(() => {
    const savedWords = localStorage.getItem('ieltsWords');
    return savedWords ? JSON.parse(savedWords) : ieltsWordList;
  });

  const [status, setStatus] = useState<LearningStatus>(() => {
    const savedStatus = localStorage.getItem('learningStatus');
    return savedStatus ? JSON.parse(savedStatus) : {
      totalWords: ieltsWordList.length,
      learnedWords: 0,
      toReviewToday: 0,
      dailyGoal: 10,
      streak: 0,
      lastStudyDate: null
    };
  });

  // Calculate the next review time based on the review count
  const calculateNextReview = (reviewCount: number): number => {
    const interval = reviewCount >= reviewIntervals.length 
      ? reviewIntervals[reviewIntervals.length - 1] 
      : reviewIntervals[reviewCount];
    return Date.now() + interval * 60 * 60 * 1000; // Convert hours to milliseconds
  };

  // Update localStorage whenever words or status change
  useEffect(() => {
    localStorage.setItem('ieltsWords', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('learningStatus', JSON.stringify(status));
  }, [status]);

  // Update stats daily
  useEffect(() => {
    const updateDailyStats = () => {
      const now = Date.now();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayTimestamp = today.getTime();
      
      // Count words due for review today
      const toReviewToday = words.filter(word => 
        word.nextReview && word.nextReview <= todayTimestamp + 24 * 60 * 60 * 1000
      ).length;
      
      // Check streak
      let streak = status.streak;
      const lastStudyDate = status.lastStudyDate;
      
      if (lastStudyDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        // If last study was before yesterday, reset streak
        if (lastStudyDate < yesterday.getTime()) {
          streak = 0;
        }
      }
      
      setStatus(prev => ({
        ...prev,
        toReviewToday,
        streak
      }));
    };
    
    updateDailyStats();
    
    // Set up daily update
    const today = new Date();
    today.setHours(24, 0, 0, 0); // Set to midnight
    const timeToMidnight = today.getTime() - Date.now();
    
    const timer = setTimeout(updateDailyStats, timeToMidnight);
    return () => clearTimeout(timer);
  }, [words, status.streak, status.lastStudyDate]);

  const addWord = (newWord: Omit<Word, 'id' | 'lastReviewed' | 'nextReview' | 'reviewCount' | 'known'>) => {
    const word: Word = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...newWord,
      lastReviewed: null,
      nextReview: null,
      reviewCount: 0,
      known: false
    };
    
    setWords(prev => [...prev, word]);
    setStatus(prev => ({
      ...prev,
      totalWords: prev.totalWords + 1
    }));
  };

  const updateWord = (updatedWord: Word) => {
    setWords(prev => prev.map(word => 
      word.id === updatedWord.id ? updatedWord : word
    ));
  };

  const deleteWord = (id: string) => {
    setWords(prev => prev.filter(word => word.id !== id));
    setStatus(prev => ({
      ...prev,
      totalWords: prev.totalWords - 1,
      learnedWords: prev.learnedWords - (words.find(w => w.id === id)?.known ? 1 : 0)
    }));
  };

  const markWordAsKnown = (id: string, known: boolean) => {
    setWords(prev => prev.map(word => {
      if (word.id === id) {
        return {
          ...word,
          known,
          lastReviewed: known ? Date.now() : word.lastReviewed,
          nextReview: known ? calculateNextReview(0) : word.nextReview,
          reviewCount: known ? 1 : word.reviewCount
        };
      }
      return word;
    }));
    
    setStatus(prev => {
      // Update learning status
      const now = Date.now();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      
      // Check if we should increment streak
      let newStreak = prev.streak;
      if (prev.lastStudyDate === null || prev.lastStudyDate < todayTimestamp) {
        newStreak += 1;
      }
      
      return {
        ...prev,
        learnedWords: known 
          ? prev.learnedWords + 1 
          : Math.max(0, prev.learnedWords - 1),
        lastStudyDate: now,
        streak: newStreak
      };
    });
  };

  const reviewWord = (id: string, successful: boolean) => {
    setWords(prev => prev.map(word => {
      if (word.id === id) {
        const newReviewCount = successful 
          ? Math.min((word.reviewCount || 0) + 1, reviewIntervals.length)
          : Math.max((word.reviewCount || 0) - 1, 0);
          
        return {
          ...word,
          lastReviewed: Date.now(),
          nextReview: calculateNextReview(newReviewCount),
          reviewCount: newReviewCount,
          known: true
        };
      }
      return word;
    }));
    
    // Update learning status
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    setStatus(prev => {
      // Check if we should increment streak
      let newStreak = prev.streak;
      if (prev.lastStudyDate === null || prev.lastStudyDate < todayTimestamp) {
        newStreak += 1;
      }
      
      return {
        ...prev,
        learnedWords: successful && words.find(w => w.id === id)?.known === false
          ? prev.learnedWords + 1 
          : prev.learnedWords,
        lastStudyDate: now,
        streak: newStreak
      };
    });
  };

  const getWordsToReview = (): Word[] => {
    const now = Date.now();
    return words.filter(word => word.nextReview && word.nextReview <= now);
  };

  const resetProgress = () => {
    setWords(ieltsWordList);
    setStatus({
      totalWords: ieltsWordList.length,
      learnedWords: 0,
      toReviewToday: 0,
      dailyGoal: 10,
      streak: 0,
      lastStudyDate: null
    });
  };

  const exportData = (): string => {
    return JSON.stringify({
      words,
      status
    });
  };

  const importData = (data: string): boolean => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.words && parsedData.status) {
        setWords(parsedData.words);
        setStatus(parsedData.status);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  };

  const updateDailyGoal = (goal: number) => {
    setStatus(prev => ({
      ...prev,
      dailyGoal: goal
    }));
  };

  return (
    <VocabularyContext.Provider value={{
      words,
      status,
      addWord,
      updateWord,
      deleteWord,
      markWordAsKnown,
      reviewWord,
      getWordsToReview,
      resetProgress,
      exportData,
      importData,
      updateDailyGoal
    }}>
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = (): VocabularyContextType => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};
