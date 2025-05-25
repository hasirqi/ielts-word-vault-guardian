import { Word } from '@prisma/client';

export type WordCreateInput = Omit<Word, 'id' | 'sequenceNumber' | 'lastReviewed' | 'nextReview' | 'reviewCount' | 'known'> & { id?: string };
export type WordUpdateInput = Partial<Omit<Word, 'id' | 'sequenceNumber' | 'lastReviewed' | 'nextReview' | 'reviewCount'>> & { known?: boolean };

export async function getWords(): Promise<any[]> {
  try {
    const res = await fetch(`/api/words`);
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API error: ${res.status} ${res.statusText}. Body: ${errorBody}`);
    }
    const data = await res.json() as any[];

    return data.map(word => ({
      ...word,
      // Ensure etymology is parsed if it's a JSON string
      etymology: word.etymology && typeof word.etymology === 'string' &&
        (word.etymology.startsWith('{') || word.etymology.startsWith('[')) ? JSON.parse(word.etymology) : word.etymology,
      // Convert to timestamps as expected by VocabularyContext
      lastReviewed: word.lastReviewed ? new Date(word.lastReviewed).getTime() : null,
      nextReview: word.nextReview ? new Date(word.nextReview).getTime() : null,
      // Add definitions object for compatibility
      definitions: {
        en: word.definitionEn || '',
        zh: word.definitionZh || ''
      }
    }));
  } catch (error) {
    console.error('API getWords failed:', error);
    return [];
  }
}

export async function addWord(wordData: WordCreateInput): Promise<Word> {
  const response = await fetch(`/api/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wordData)
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }
  return response.json();
}

export async function importInitialWords(): Promise<{ count: number; source?: string }> {
  const response = await fetch(`/api/words/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'importInitial' })
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }
  return response.json();
}

export async function batchAddClientWords(words: WordCreateInput[]): Promise<{ count: number }> {
  const response = await fetch(`/api/words/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(words)
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }
  return response.json();
}

export async function updateWord(id: string, updates: WordUpdateInput): Promise<Word> {
  const response = await fetch(`/api/words/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }
  return response.json();
}

export async function updateWordReview(id: string, successful: boolean): Promise<Word> {
  const response = await fetch(`/api/words/${id}/review`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ successful })
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }
  return response.json();
}

export async function deleteWord(id: string): Promise<{ success: boolean; id?: string }> {
  const response = await fetch(`/api/words/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }
  return response.json();
}

export async function clearAllWords(): Promise<{ count: number }> {
  const response = await fetch(`/api/words/clear`, {
    method: 'POST'
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }
  return response.json();
}

// Legacy function names for compatibility
export const updateWordStatus = updateWord;
export const importLocalWords = importInitialWords;
export const clearWords = clearAllWords;
