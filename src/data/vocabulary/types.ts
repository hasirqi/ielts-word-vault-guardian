
import { Word } from '@/contexts/VocabularyContext';

// Helper functions for word management
export function createWordBatch(words: Word[]): {
  getWordBatch: (start: number, count: number) => Word[];
} {
  return {
    getWordBatch: (start: number, count: number) => words.slice(start, start + count)
  };
}
