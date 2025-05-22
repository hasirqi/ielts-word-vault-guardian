
import { Word } from '@/contexts/VocabularyContext';

// Academic vocabulary (1-50)
export const academicWords: Word[] = [
  {
    id: 'ielts-1',
    word: 'abandon',
    phonetic: '/əˈbændən/',
    etymology: {
      roots: 'a (away) + bandon (control)',
      affixes: 'a- (away from), -on (action)',
      explanation: 'From Old French "abandoner", literally meaning "to leave to someone\'s control or jurisdiction".'
    },
    definitions: {
      en: 'To leave a place, thing, or person completely, with no intention of returning',
      zh: '丢弃；抛弃；放弃'
    },
    example: 'The crew was forced to abandon the ship during the storm.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-2',
    word: 'abstract',
    phonetic: '/ˈæbstrækt/',
    etymology: {
      roots: 'abs (away) + tract (pull)',
      affixes: 'ab- (away), -tract (to pull)',
      explanation: 'From Latin "abstractus", meaning "drawn away". The idea is to pull or draw away from concrete reality into the realm of thought.'
    },
    definitions: {
      en: 'Existing in thought or as an idea but not having a physical existence',
      zh: '抽象的；理论上的'
    },
    example: 'The professor\'s lecture was too abstract for most students to understand.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-3',
    word: 'academic',
    phonetic: '/ˌækəˈdemɪk/',
    etymology: {
      roots: 'akademeia (Greek name)',
      explanation: 'Derived from "Akademeia", the name of the grove where Plato taught in ancient Athens.'
    },
    definitions: {
      en: 'Relating to education, especially at college or university level',
      zh: '学术的；教学的；理论的'
    },
    example: 'Her academic achievements were impressive.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-4',
    word: 'accelerate',
    phonetic: '/əkˈseləreɪt/',
    etymology: {
      roots: 'ad (towards) + celere (swift)',
      affixes: 'ac- (towards), -ate (make)',
      explanation: 'From Latin "accelerare", meaning "to hasten, to quicken". Related to "celerity" (swiftness).'
    },
    definitions: {
      en: 'To make something happen more quickly or earlier',
      zh: '加速；促进；增速'
    },
    example: 'The government is taking measures to accelerate economic growth.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-5',
    word: 'accommodate',
    phonetic: '/əˈkɒmədeɪt/',
    etymology: {
      roots: 'ad (to) + commodus (fitting, suitable)',
      affixes: 'ac- (to), -ate (make)',
      explanation: 'From Latin "accommodare", meaning "to make fit". The word suggests adapting or adjusting to make something suitable.'
    },
    definitions: {
      en: 'To provide someone with a place to live or stay',
      zh: '容纳；提供住宿；使适应'
    },
    example: 'The hotel can accommodate up to 500 guests.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  // Add more academic words here
];
