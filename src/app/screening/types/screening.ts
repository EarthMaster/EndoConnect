export type PainFrequency = 'rarely' | 'sometimes' | 'frequently' | 'always';
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface PainAssessment {
  frequency: PainFrequency;
  intensity: number; // 0-10
  duration: number; // months
  locations: string[]; // body map locations
}

export interface MenstrualSymptoms {
  dysmenorrhea: boolean;
  intensity: number; // 0-10
  cycleRegularity: 'regular' | 'slightly_irregular' | 'highly_irregular';
  bleedingIntensity: 'light' | 'normal' | 'heavy' | 'very_heavy';
  duration: number; // days
}

export interface UrinarySymptoms {
  frequency: boolean;
  urgency: boolean;
  pain: boolean;
  incontinence: boolean;
  cyclical: boolean;
}

export interface IntestinalSymptoms {
  bloating: boolean;
  constipation: boolean;
  diarrhea: boolean;
  painDuringBowel: boolean;
  cyclical: boolean;
}

export interface EmotionalSymptoms {
  anxiety: boolean;
  depression: boolean;
  irritability: boolean;
  fatigue: boolean;
  impactOnLife: number; // 0-10
}

export interface ScreeningAnswers {
  painAssessment: PainAssessment;
  menstrualSymptoms: MenstrualSymptoms;
  urinarySymptoms: UrinarySymptoms;
  intestinalSymptoms: IntestinalSymptoms;
  emotionalSymptoms: EmotionalSymptoms;
}

export interface RiskAssessment {
  riskLevel: RiskLevel;
  score: number;
  factors: {
    pain: number;
    menstrual: number;
    urinary: number;
    intestinal: number;
    emotional: number;
  };
  recommendations: {
    immediateActions: string[];
    educationalContent: string[];
    followUp: {
      timeframe: string;
      type: string;
    };
  };
}

export interface ScreeningResult {
  id: string;
  userId: string;
  answers: ScreeningAnswers;
  riskAssessment: RiskAssessment;
  createdAt: string;
  updatedAt: string;
} 