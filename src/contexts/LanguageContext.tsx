
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'zh';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.learn': 'Learn',
    'nav.vocabulary': 'Vocabulary',
    'nav.review': 'Review',
    'nav.stats': 'Statistics',
    'nav.settings': 'Settings',
    
    // Home page
    'home.title': 'IELTS Vocabulary Master',
    'home.subtitle': 'Boost your IELTS score with effective vocabulary study',
    'home.totalWords': 'Total Words',
    'home.learned': 'Words Learned',
    'home.toReview': 'Words to Review',
    'home.startStudy': 'Start Studying',
    'home.viewVocab': 'View Vocabulary List',
    'home.dailyGoal': 'Daily Goal',
    'home.streak': 'Day Streak',
    
    // Learn mode
    'learn.title': 'Learn Mode',
    'learn.sequential': 'Sequential',
    'learn.random': 'Random',
    'learn.spelling': 'Spelling Test',
    'learn.listening': 'Listening Test',
    'learn.newWords': 'New Words',
    'learn.reviewWords': 'Review Words',
    'learn.start': 'Start',
    'learn.next': 'Next',
    'learn.previous': 'Previous',
    'learn.check': 'Check',
    'learn.correct': 'Correct',
    'learn.incorrect': 'Incorrect',
    'learn.reveal': 'Reveal',
    'learn.showExample': 'Show Example',
    'learn.showAnswer': 'Show Answer',
    'learn.markAsKnown': 'I Know This',
    'learn.markAsUnknown': 'I Don\'t Know This',
    
    // Vocabulary list
    'vocab.search': 'Search Words',
    'vocab.sort': 'Sort By',
    'vocab.filter': 'Filter',
    'vocab.add': 'Add Word',
    'vocab.edit': 'Edit',
    'vocab.delete': 'Delete',
    'vocab.word': 'Word',
    'vocab.phonetics': 'Phonetics',
    'vocab.meaning': 'Meaning',
    'vocab.addNew': 'Add New Word',
    'vocab.editWord': 'Edit Word',
    'vocab.deleteConfirm': 'Are you sure you want to delete this word?',
    
    // Review
    'review.due': 'Due for Review',
    'review.today': 'Today',
    'review.tomorrow': 'Tomorrow',
    'review.upcoming': 'Upcoming',
    'review.startReview': 'Start Review',
    
    // Stats
    'stats.daily': 'Daily Progress',
    'stats.weekly': 'Weekly Overview',
    'stats.accuracy': 'Accuracy',
    'stats.time': 'Study Time',
    'stats.export': 'Export Report',
    
    // Settings
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.notifications': 'Review Notifications',
    'settings.dailyGoal': 'Daily Word Goal',
    'settings.resetProgress': 'Reset Progress',
    'settings.exportData': 'Export Data',
    'settings.importData': 'Import Data',
    'settings.resetConfirm': 'Are you sure? This will reset all your progress.',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.loading': 'Loading...',
    'common.success': 'Success!',
    'common.error': 'Error',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.confirm': 'Confirm',
  },
  zh: {
    // 导航
    'nav.home': '首页',
    'nav.learn': '学习',
    'nav.vocabulary': '词汇表',
    'nav.review': '复习',
    'nav.stats': '统计',
    'nav.settings': '设置',
    
    // 首页
    'home.title': '雅思词汇大师',
    'home.subtitle': '高效学习词汇，提高雅思分数',
    'home.totalWords': '单词总量',
    'home.learned': '已学单词',
    'home.toReview': '待复习',
    'home.startStudy': '开始学习',
    'home.viewVocab': '查看词汇表',
    'home.dailyGoal': '每日目标',
    'home.streak': '连续学习',
    
    // 学习模式
    'learn.title': '学习模式',
    'learn.sequential': '顺序模式',
    'learn.random': '随机模式',
    'learn.spelling': '拼写测试',
    'learn.listening': '听写测试',
    'learn.newWords': '新单词',
    'learn.reviewWords': '复习单词',
    'learn.start': '开始',
    'learn.next': '下一个',
    'learn.previous': '上一个',
    'learn.check': '检查',
    'learn.correct': '正确',
    'learn.incorrect': '错误',
    'learn.reveal': '显示',
    'learn.showExample': '显示例句',
    'learn.showAnswer': '显示答案',
    'learn.markAsKnown': '我认识',
    'learn.markAsUnknown': '不认识',
    
    // 词汇表
    'vocab.search': '搜索单词',
    'vocab.sort': '排序方式',
    'vocab.filter': '筛选',
    'vocab.add': '添加单词',
    'vocab.edit': '编辑',
    'vocab.delete': '删除',
    'vocab.word': '单词',
    'vocab.phonetics': '音标',
    'vocab.meaning': '释义',
    'vocab.addNew': '添加新单词',
    'vocab.editWord': '编辑单词',
    'vocab.deleteConfirm': '确定要删除这个单词吗？',
    
    // 复习
    'review.due': '待复习',
    'review.today': '今天',
    'review.tomorrow': '明天',
    'review.upcoming': '即将到来',
    'review.startReview': '开始复习',
    
    // 统计
    'stats.daily': '每日进度',
    'stats.weekly': '每周概览',
    'stats.accuracy': '准确率',
    'stats.time': '学习时间',
    'stats.export': '导出报告',
    
    // 设置
    'settings.language': '语言',
    'settings.theme': '主题',
    'settings.light': '浅色',
    'settings.dark': '深色',
    'settings.notifications': '复习提醒',
    'settings.dailyGoal': '每日单词目标',
    'settings.resetProgress': '重置进度',
    'settings.exportData': '导出数据',
    'settings.importData': '导入数据',
    'settings.resetConfirm': '您确定吗？这将重置所有进度。',
    
    // 通用
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.loading': '加载中...',
    'common.success': '成功！',
    'common.error': '错误',
    'common.yes': '是',
    'common.no': '否',
    'common.confirm': '确认',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'en';
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
