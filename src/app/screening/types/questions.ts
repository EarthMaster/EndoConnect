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
    id: 'pelvic_pain_frequency',
    question: 'Com que frequência você sente dor pélvica?',
    description: 'Considere a frequência da dor na região pélvica nos últimos 3 meses.',
    options: [
      { value: 'never', label: 'Não sinto', description: 'Sem dor pélvica' },
      { value: 'rarely', label: 'Raramente', description: 'Menos de uma vez por mês' },
      { value: 'sometimes', label: 'Às vezes', description: '1-2 vezes por mês' },
      { value: 'frequently', label: 'Frequentemente', description: 'Semanalmente' },
      { value: 'always', label: 'Sempre', description: 'Quase todos os dias' }
    ]
  },
  {
    id: 'pain_location',
    question: 'Onde você sente dor?',
    description: 'Selecione todas as regiões onde você sente dor.',
    type: 'multiple',
    options: [
      { value: 'lower_abdomen', label: 'Baixo ventre' },
      { value: 'pelvis', label: 'Região pélvica' },
      { value: 'lower_back', label: 'Lombar' },
      { value: 'rectum', label: 'Região retal' },
      { value: 'vagina', label: 'Vagina' },
      { value: 'bladder', label: 'Bexiga' }
    ]
  },
  {
    id: 'menstrual_pain_worsening',
    question: 'A dor piora durante o período menstrual?',
    description: 'Considere se há intensificação da dor durante a menstruação.',
    options: [
      { value: 'no', label: 'Não', description: 'Não há piora durante a menstruação' },
      { value: 'mild', label: 'Leve piora', description: 'Piora ligeiramente' },
      { value: 'moderate', label: 'Piora moderada', description: 'Piora consideravelmente' },
      { value: 'severe', label: 'Piora intensa', description: 'Piora muito durante a menstruação' }
    ]
  },
  {
    id: 'dyspareunia',
    question: 'Você sente dor durante ou após relações sexuais?',
    description: 'Dispareunia - dor durante a penetração ou após o ato sexual.',
    options: [
      { value: 'never', label: 'Nunca', description: 'Não sinto dor' },
      { value: 'rarely', label: 'Raramente', description: 'Ocasionalmente' },
      { value: 'sometimes', label: 'Às vezes', description: 'Em algumas relações' },
      { value: 'frequently', label: 'Frequentemente', description: 'Na maioria das vezes' },
      { value: 'always', label: 'Sempre', description: 'Em todas as relações' }
    ]
  },
  {
    id: 'intestinal_symptoms',
    question: 'Você tem sintomas intestinais cíclicos?',
    description: 'Sintomas que pioram durante o período menstrual.',
    type: 'multiple',
    options: [
      { value: 'constipation', label: 'Constipação (intestino preso)' },
      { value: 'diarrhea', label: 'Diarreia' },
      { value: 'bowel_pain', label: 'Dor ao evacuar' },
      { value: 'bloating', label: 'Inchaço abdominal' },
      { value: 'gas', label: 'Gases excessivos' }
    ]
  },
  {
    id: 'urinary_symptoms',
    question: 'Você tem sintomas urinários cíclicos?',
    description: 'Sintomas urinários que pioram durante o período menstrual.',
    type: 'multiple',
    options: [
      { value: 'dysuria', label: 'Dor ao urinar' },
      { value: 'hematuria', label: 'Sangue na urina' },
      { value: 'urgency', label: 'Urgência urinária' },
      { value: 'frequency', label: 'Aumento da frequência urinária' },
      { value: 'incomplete', label: 'Sensação de esvaziamento incompleto' }
    ]
  }
];