
import { Word } from '@/contexts/VocabularyContext';

// Science vocabulary (501-1000)
export const scienceWords: Word[] = [
  {
    id: 'ielts-501',
    word: 'molecule',
    phonetic: '/ˈmɒlɪkjuːl/',
    etymology: {
      roots: 'moles (mass) + -cule (diminutive)',
      explanation: 'From Latin "molecula", a diminutive of "moles" meaning "mass". The term refers to a tiny mass or particle that is the fundamental unit of a chemical compound.'
    },
    definitions: {
      en: 'A group of atoms bonded together, representing the smallest fundamental unit of a chemical compound',
      zh: '分子'
    },
    example: 'Water molecules consist of two hydrogen atoms and one oxygen atom.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-502',
    word: 'hypothesis',
    phonetic: '/haɪˈpɒθəsɪs/',
    etymology: {
      roots: 'hypo (under) + thesis (placing)',
      explanation: 'From Greek "hypothesis", literally meaning "placing under" or "supposition". It refers to a tentative assumption made in order to draw out and test its logical consequences.'
    },
    definitions: {
      en: 'A proposed explanation for a phenomenon that can be tested through further investigation',
      zh: '假设；假说'
    },
    example: 'The scientist developed a hypothesis to explain the unusual results of the experiment.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-503',
    word: 'catalyst',
    phonetic: '/ˈkætəlɪst/',
    etymology: {
      roots: 'kata (down) + lyein (to loosen)',
      explanation: 'From Greek "katalysis", meaning "dissolution" or "to dissolve". In chemistry, it refers to a substance that increases the rate of a reaction without itself being consumed.'
    },
    definitions: {
      en: 'A substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change',
      zh: '催化剂'
    },
    example: 'Enzymes act as catalysts in biological reactions in the human body.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-504',
    word: 'ecosystem',
    phonetic: '/ˈiːkəʊsɪstəm/',
    etymology: {
      roots: 'oikos (house) + systema (system)',
      explanation: 'A modern scientific term combining the Greek "oikos" (house or environment) and "systema" (organized whole). It describes a biological community of interacting organisms and their physical environment.'
    },
    definitions: {
      en: 'A biological community of interacting organisms and their physical environment',
      zh: '生态系统'
    },
    example: 'The coral reef is a diverse ecosystem that supports thousands of marine species.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  {
    id: 'ielts-505',
    word: 'quantum',
    phonetic: '/ˈkwɒntəm/',
    etymology: {
      roots: 'quantus (how much)',
      explanation: 'From Latin "quantum", meaning "how much" or "how great". In physics, it refers to the smallest discrete unit of a physical property, especially energy.'
    },
    definitions: {
      en: 'A discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents',
      zh: '量子'
    },
    example: 'Quantum mechanics describes the behavior of particles at the subatomic level.',
    lastReviewed: null,
    nextReview: null,
    reviewCount: 0,
    known: false
  },
  // Add more science words here
];
