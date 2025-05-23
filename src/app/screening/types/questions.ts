export interface Question {
  id: string;
  question: string;
  description: string;
  type?: 'scale' | 'multiple';
  min?: number;
  max?: number;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
}

export const questions: Question[] = [
  {
    id: 'pain_assessment',
    question: 'Com que frequência você sente dor pélvica?',
    description: 'Considere a frequência da dor na região pélvica nos últimos 3 meses.',
    options: [
      { value: 'rarely', label: 'Raramente', description: 'Menos de uma vez por mês' },
      { value: 'sometimes', label: 'Às vezes', description: '1-2 vezes por mês' },
      { value: 'frequently', label: 'Frequentemente', description: 'Semanalmente' },
      { value: 'always', label: 'Sempre', description: 'Quase todos os dias' }
    ]
  },
  {
    id: 'pain_intensity',
    question: 'Qual a intensidade da sua dor?',
    description: 'Use a escala de 0 a 10, onde 0 é sem dor e 10 é a pior dor possível.',
    type: 'scale',
    min: 0,
    max: 10
  },
  {
    id: 'pain_duration',
    question: 'Há quanto tempo você sente esta dor?',
    description: 'Selecione o período aproximado.',
    options: [
      { value: '1', label: 'Menos de 3 meses' },
      { value: '3', label: '3 a 6 meses' },
      { value: '6', label: 'Mais de 6 meses' }
    ]
  },
  {
    id: 'menstrual_symptoms',
    question: 'Como são seus ciclos menstruais?',
    description: 'Selecione todas as opções que se aplicam.',
    type: 'multiple',
    options: [
      { value: 'dysmenorrhea', label: 'Cólicas intensas' },
      { value: 'irregular', label: 'Ciclos irregulares' },
      { value: 'heavy', label: 'Sangramento intenso' },
      { value: 'long', label: 'Menstruação prolongada' }
    ]
  },
  {
    id: 'urinary_symptoms',
    question: 'Você tem sintomas urinários?',
    description: 'Selecione todas as opções que se aplicam.',
    type: 'multiple',
    options: [
      { value: 'frequency', label: 'Aumento da frequência' },
      { value: 'urgency', label: 'Urgência para urinar' },
      { value: 'pain', label: 'Dor ao urinar' },
      { value: 'incontinence', label: 'Incontinência' }
    ]
  },
  {
    id: 'intestinal_symptoms',
    question: 'Você tem sintomas intestinais?',
    description: 'Selecione todas as opções que se aplicam.',
    type: 'multiple',
    options: [
      { value: 'bloating', label: 'Distensão abdominal' },
      { value: 'constipation', label: 'Constipação' },
      { value: 'diarrhea', label: 'Diarreia' },
      { value: 'pain', label: 'Dor ao evacuar' }
    ]
  },
  {
    id: 'emotional_symptoms',
    question: 'Como você se sente emocionalmente?',
    description: 'Selecione todas as opções que se aplicam.',
    type: 'multiple',
    options: [
      { value: 'anxiety', label: 'Ansiedade' },
      { value: 'depression', label: 'Depressão' },
      { value: 'irritability', label: 'Irritabilidade' },
      { value: 'fatigue', label: 'Fadiga' }
    ]
  },
  {
    id: 'impact',
    question: 'Qual o impacto dos sintomas na sua vida diária?',
    description: 'Use a escala de 0 a 10, onde 0 é sem impacto e 10 é impacto máximo.',
    type: 'scale',
    min: 0,
    max: 10
  }
]; 