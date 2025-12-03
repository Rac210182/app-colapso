// Types for COLAPSO app

export type Language = 'pt-BR' | 'pt-PT' | 'en' | 'es' | 'fr' | 'it';

export type SubscriptionStatus = 'trial' | 'active' | 'canceled' | 'expired';

export type SubscriptionPlan = 'monthly' | 'annual' | null;

export type UserLevel = 'despertar' | 'integracao' | 'amplificacao' | 'mestre';

export type TopicType = 'sombra' | 'espelho-livre' | 'fechamento' | 'raio-x' | 'fim-ego' | 'manha' | 'campo-quantico';

export interface User {
  uid: string;
  email: string;
  name: string;
  birthDate: string;
  gender: string;
  language: Language;
  onboardingCompleted: boolean;
  startDate: string;
  currentDay: number;
  level: UserLevel;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscriptionPlan;
  trialEndDate: string;
  subscriptionEndDate?: string;
  daysInMirror: number;
  daysCollapsed: number;
  daysSkipped: number;
  subliminalEnabled: boolean;
}

export interface OnboardingAnswers {
  q1_spiritual_doubt: string;
  q2_loneliness_scale: number;
  q3_purpose_loss: string;
  q4_pain_worsened: string;
  q5_spiritual_guilt: string;
  q6_disconnection: string;
  q7_fear_unknown: string;
  q8_guru_confusion: string;
  q9_faith_test: string;
  q10_integration_word: string;
}

export interface TopicResponse {
  topicType: TopicType;
  date: string;
  day: number;
  responses: string[];
  audioUrl?: string;
  report?: string;
  rating?: number;
}

export interface Master {
  name: string;
  quote: string;
  source: string;
  translations: {
    [key in Language]: {
      quote: string;
      source: string;
    };
  };
}

export interface Translation {
  [key: string]: {
    [key in Language]: string;
  };
}
