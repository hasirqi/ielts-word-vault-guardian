
import { Word } from '@/contexts/VocabularyContext';
import { academicWords } from './academic';
import { generalWords } from './general';
import { scienceWords } from './science';
import { businessWords } from './business';
import { technologyWords } from './technology';
import { environmentWords } from './environment';
import { createWordBatch } from './types';

// Combine all word lists
export const extendedIeltsWordList: Word[] = [
  ...academicWords,
  ...generalWords,
  ...scienceWords,
  ...businessWords,
  ...technologyWords,
  ...environmentWords
];

// Function to get a subset of the word list (for pagination or performance)
export function getWordBatch(start: number, count: number): Word[] {
  return extendedIeltsWordList.slice(start, start + count);
}

// Function to get the full word list
export function getFullWordList(): Word[] {
  return extendedIeltsWordList;
}

// Get words by category
export function getAcademicWords(): Word[] {
  return academicWords;
}

export function getGeneralWords(): Word[] {
  return generalWords;
}

export function getScienceWords(): Word[] {
  return scienceWords;
}

export function getBusinessWords(): Word[] {
  return businessWords;
}

export function getTechnologyWords(): Word[] {
  return technologyWords;
}

export function getEnvironmentWords(): Word[] {
  return environmentWords;
}

// Export all categories for convenience
export const wordCategories = {
  academic: academicWords,
  general: generalWords,
  science: scienceWords,
  business: businessWords,
  technology: technologyWords,
  environment: environmentWords,
};
