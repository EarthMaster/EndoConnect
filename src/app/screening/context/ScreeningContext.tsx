'use client'

import { createContext, useContext, useState, ReactNode } from 'react';
import { ScreeningAnswers } from '../types';
import { questions } from '../types/questions';

interface ScreeningContextType {
  answers: ScreeningAnswers;
  currentStep: number;
  setAnswer: (questionId: string, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined);

const initialAnswers: ScreeningAnswers = {
  painAssessment: {
    frequency: 'rarely',
    intensity: 0,
    duration: 0,
    locations: []
  },
  menstrualSymptoms: {
    dysmenorrhea: false,
    intensity: 0,
    cycleRegularity: 'regular',
    bleedingIntensity: 'normal',
    duration: 0
  },
  urinarySymptoms: {
    frequency: false,
    urgency: false,
    pain: false,
    incontinence: false,
    cyclical: false
  },
  intestinalSymptoms: {
    bloating: false,
    constipation: false,
    diarrhea: false,
    painDuringBowel: false,
    cyclical: false
  },
  emotionalSymptoms: {
    anxiety: false,
    depression: false,
    irritability: false,
    fatigue: false,
    impactOnLife: 0
  }
};

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<ScreeningAnswers>(initialAnswers);
  const [currentStep, setCurrentStep] = useState(0);

  const setAnswer = (questionId: string, value: any) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      
      switch (questionId) {
        case 'pain_assessment':
          newAnswers.painAssessment.frequency = value;
          break;
        case 'pain_intensity':
          newAnswers.painAssessment.intensity = value;
          break;
        case 'pain_duration':
          newAnswers.painAssessment.duration = parseInt(value);
          break;
        case 'menstrual_symptoms':
          // Handle multiple selections for menstrual symptoms
          if (value === 'dysmenorrhea') newAnswers.menstrualSymptoms.dysmenorrhea = true;
          if (value === 'irregular') newAnswers.menstrualSymptoms.cycleRegularity = 'irregular';
          if (value === 'heavy') newAnswers.menstrualSymptoms.bleedingIntensity = 'heavy';
          if (value === 'long') newAnswers.menstrualSymptoms.duration = 7;
          break;
        case 'urinary_symptoms':
          // Handle multiple selections for urinary symptoms
          if (value === 'frequency') newAnswers.urinarySymptoms.frequency = true;
          if (value === 'urgency') newAnswers.urinarySymptoms.urgency = true;
          if (value === 'pain') newAnswers.urinarySymptoms.pain = true;
          if (value === 'incontinence') newAnswers.urinarySymptoms.incontinence = true;
          break;
        case 'intestinal_symptoms':
          // Handle multiple selections for intestinal symptoms
          if (value === 'bloating') newAnswers.intestinalSymptoms.bloating = true;
          if (value === 'constipation') newAnswers.intestinalSymptoms.constipation = true;
          if (value === 'diarrhea') newAnswers.intestinalSymptoms.diarrhea = true;
          if (value === 'pain') newAnswers.intestinalSymptoms.painDuringBowel = true;
          break;
        case 'emotional_symptoms':
          // Handle multiple selections for emotional symptoms
          if (value === 'anxiety') newAnswers.emotionalSymptoms.anxiety = true;
          if (value === 'depression') newAnswers.emotionalSymptoms.depression = true;
          if (value === 'irritability') newAnswers.emotionalSymptoms.irritability = true;
          if (value === 'fatigue') newAnswers.emotionalSymptoms.fatigue = true;
          break;
        case 'impact':
          newAnswers.emotionalSymptoms.impactOnLife = value;
          break;
      }
      
      return newAnswers;
    });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <ScreeningContext.Provider
      value={{
        answers,
        currentStep,
        setAnswer,
        nextStep,
        prevStep,
        isLastStep: currentStep === questions.length - 1,
        isFirstStep: currentStep === 0
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const context = useContext(ScreeningContext);
  if (context === undefined) {
    throw new Error('useScreening must be used within a ScreeningProvider');
  }
  return context;
} 