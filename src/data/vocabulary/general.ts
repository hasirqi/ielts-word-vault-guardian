
import { Word } from '@/contexts/VocabularyContext';

// General vocabulary (51-500)
export const generalWords: Word[] = [
  {
    id: 'ielts-6',
    word: 'accomplish',
    phonetic: '/əˈkʌmplɪʃ/',
    etymology: {
      roots: 'ad (to) + com (completely) + plere (to fill)',
      affixes: 'ac- (to), -ish (make or do)',
      explanation: 'From Latin "accomplere", meaning "to complete". The idea is to fill something completely or bring it to completion.'
    },
    definitions: {
      en: 'To succeed in doing or completing something',
      zh: '完成；实现；达成'
    },
    example: 'She accomplished her goal of running a marathon before turning 40.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-7',
    word: 'accumulate',
    phonetic: '/əˈkjuːmjʊleɪt/',
    etymology: {
      roots: 'ad (to) + cumulus (heap)',
      affixes: 'ac- (to), -ate (make or cause)',
      explanation: 'From Latin "accumulare", meaning "to heap up". The word conveys the idea of gathering or collecting things into a growing pile.'
    },
    definitions: {
      en: 'To gradually collect more and more of something over time',
      zh: '积累；积聚；堆积'
    },
    example: 'He accumulated a vast fortune over his lifetime.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-8',
    word: 'accurate',
    phonetic: '/ˈækjʊrət/',
    etymology: {
      roots: 'ad (to) + cura (care)',
      explanation: 'From Latin "accuratus", meaning "done with care". The word suggests precision that comes from careful attention to detail.'
    },
    definitions: {
      en: 'Correct and exact in all details',
      zh: '准确的；精确的'
    },
    example: 'Scientists need accurate measurements for their experiments.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-9',
    word: 'achieve',
    phonetic: '/əˈtʃiːv/',
    etymology: {
      roots: 'ad (to) + caput (head)',
      explanation: 'From Old French "achever", meaning "to complete", which comes from the phrase "à chef" (to head or to end). The idea is to bring something to its head or conclusion.'
    },
    definitions: {
      en: 'To successfully complete a goal or purpose',
      zh: '达到；实现；完成'
    },
    example: 'With hard work, you can achieve anything you set your mind to.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-10',
    word: 'acknowledge',
    phonetic: '/əkˈnɒlɪdʒ/',
    etymology: {
      roots: 'ad (to) + know + ledge',
      explanation: 'From Middle English "knowlechen", combining "know" with the suffix "-ledge" (condition or state). It means to admit to knowing something.'
    },
    definitions: {
      en: 'To accept or admit the existence or truth of something',
      zh: '承认；认可；答谢'
    },
    example: 'He acknowledged that he had made a mistake.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  // Add more general words here
];
