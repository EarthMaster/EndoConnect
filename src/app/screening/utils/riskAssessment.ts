import { 
  ScreeningAnswers, 
  RiskAssessment, 
  RiskLevel 
} from '../types';

export function calculateRiskAssessment(answers: ScreeningAnswers): RiskAssessment {
  // Calculate individual factor scores
  const painScore = calculatePainScore(answers.painAssessment);
  const menstrualScore = calculateMenstrualScore(answers.menstrualSymptoms);
  const urinaryScore = calculateUrinaryScore(answers.urinarySymptoms);
  const intestinalScore = calculateIntestinalScore(answers.intestinalSymptoms);
  const emotionalScore = calculateEmotionalScore(answers.emotionalSymptoms);

  // Calculate total risk score (0-100)
  const totalScore = Math.round(
    (painScore * 0.35) + // Pain has highest weight
    (menstrualScore * 0.25) +
    (urinaryScore * 0.15) +
    (intestinalScore * 0.15) +
    (emotionalScore * 0.10)
  );

  // Determine risk level
  const riskLevel = determineRiskLevel(totalScore);

  // Generate recommendations based on risk level and individual scores
  const recommendations = generateRecommendations(riskLevel, {
    pain: painScore,
    menstrual: menstrualScore,
    urinary: urinaryScore,
    intestinal: intestinalScore,
    emotional: emotionalScore
  });

  return {
    riskLevel,
    score: totalScore,
    factors: {
      pain: painScore,
      menstrual: menstrualScore,
      urinary: urinaryScore,
      intestinal: intestinalScore,
      emotional: emotionalScore
    },
    recommendations
  };
}

function calculatePainScore(pain: ScreeningAnswers['painAssessment']): number {
  let score = 0;

  // Frequency weight (0-40)
  switch (pain.frequency) {
    case 'rarely':
      score += 10;
      break;
    case 'sometimes':
      score += 20;
      break;
    case 'frequently':
      score += 30;
      break;
    case 'always':
      score += 40;
      break;
  }

  // Intensity weight (0-30)
  score += (pain.intensity / 10) * 30;

  // Duration weight (0-30)
  score += (pain.duration / 6) * 30;

  return Math.min(100, score);
}

function calculateMenstrualScore(symptoms: ScreeningAnswers['menstrualSymptoms']): number {
  let score = 0;

  // Dysmenorrhea (0-30)
  if (symptoms.dysmenorrhea) {
    score += 30;
  }

  // Cycle regularity (0-20)
  if (symptoms.cycleRegularity === 'irregular') {
    score += 20;
  }

  // Bleeding intensity (0-25)
  switch (symptoms.bleedingIntensity) {
    case 'light':
      score += 5;
      break;
    case 'normal':
      score += 10;
      break;
    case 'heavy':
      score += 25;
      break;
  }

  // Duration (0-25)
  score += (symptoms.duration / 7) * 25;

  return Math.min(100, score);
}

function calculateUrinaryScore(symptoms: ScreeningAnswers['urinarySymptoms']): number {
  let score = 0;

  // Each symptom contributes equally (20 points each)
  if (symptoms.frequency) score += 20;
  if (symptoms.urgency) score += 20;
  if (symptoms.pain) score += 20;
  if (symptoms.incontinence) score += 20;
  if (symptoms.cyclical) score += 20;

  return Math.min(100, score);
}

function calculateIntestinalScore(symptoms: ScreeningAnswers['intestinalSymptoms']): number {
  let score = 0;

  // Each symptom contributes equally (20 points each)
  if (symptoms.bloating) score += 20;
  if (symptoms.constipation) score += 20;
  if (symptoms.diarrhea) score += 20;
  if (symptoms.painDuringBowel) score += 20;
  if (symptoms.cyclical) score += 20;

  return Math.min(100, score);
}

function calculateEmotionalScore(symptoms: ScreeningAnswers['emotionalSymptoms']): number {
  let score = 0;

  // Each symptom contributes equally (20 points each)
  if (symptoms.anxiety) score += 20;
  if (symptoms.depression) score += 20;
  if (symptoms.irritability) score += 20;
  if (symptoms.fatigue) score += 20;

  // Impact on life (0-20)
  score += (symptoms.impactOnLife / 10) * 20;

  return Math.min(100, score);
}

function determineRiskLevel(score: number): 'LOW' | 'MODERATE' | 'HIGH' {
  if (score < 40) return 'LOW';
  if (score < 70) return 'MODERATE';
  return 'HIGH';
}

function generateRecommendations(
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH',
  factors: {
    pain: number;
    menstrual: number;
    urinary: number;
    intestinal: number;
    emotional: number;
  }
): RiskAssessment['recommendations'] {
  const immediateActions: string[] = [];
  const educationalContent: string[] = [];

  // Base recommendations for all risk levels
  immediateActions.push('Mantenha um diário de sintomas');
  educationalContent.push('Entendendo a Endometriose');

  // Risk level specific recommendations
  switch (riskLevel) {
    case 'LOW':
      immediateActions.push(
        'Agende uma consulta de rotina com seu ginecologista',
        'Pratique exercícios físicos regularmente'
      );
      educationalContent.push(
        'Manejo da Dor',
        'Nutrição e Endometriose'
      );
      break;

    case 'MODERATE':
      immediateActions.push(
        'Agende uma consulta com especialista em endometriose',
        'Considere iniciar um plano de exercícios específico',
        'Mantenha um registro detalhado dos sintomas'
      );
      educationalContent.push(
        'Manejo da Dor',
        'Nutrição e Endometriose',
        'Estratégias de Autocuidado',
        'Comunicação com Profissionais de Saúde'
      );
      break;

    case 'HIGH':
      immediateActions.push(
        'Procure atendimento médico imediatamente',
        'Considere buscar um centro especializado em endometriose',
        'Inicie um plano de manejo da dor com seu médico',
        'Considere terapia psicológica para suporte emocional'
      );
      educationalContent.push(
        'Manejo da Dor',
        'Nutrição e Endometriose',
        'Estratégias de Autocuidado',
        'Comunicação com Profissionais de Saúde',
        'Suporte Emocional e Saúde Mental',
        'Opções de Tratamento Avançado'
      );
      break;
  }

  // Factor-specific recommendations
  if (factors.pain > 70) {
    immediateActions.push('Considere técnicas de relaxamento e respiração');
    educationalContent.push('Técnicas de Manejo da Dor Crônica');
  }

  if (factors.menstrual > 70) {
    immediateActions.push('Mantenha um calendário menstrual detalhado');
    educationalContent.push('Entendendo seu Ciclo Menstrual');
  }

  if (factors.emotional > 70) {
    immediateActions.push('Considere buscar apoio psicológico');
    educationalContent.push('Saúde Mental e Endometriose');
  }

  return {
    immediateActions,
    educationalContent,
    followUp: {
      timeframe: riskLevel === 'HIGH' ? '1 semana' : riskLevel === 'MODERATE' ? '2 semanas' : '1 mês',
      type: riskLevel === 'HIGH' ? 'Especialista' : 'Ginecologista'
    }
  };
} 