'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Selector } from "@/components/ui/selector";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

const questions = [
  {
    id: 'pelvic_pain',
    question: 'Com que frequência você sente dor pélvica?',
    options: [
      { value: 'rarely', label: 'Raramente' },
      { value: 'sometimes', label: 'Às vezes' },
      { value: 'often', label: 'Frequentemente' },
      { value: 'always', label: 'Sempre' }
    ]
  },
  {
    id: 'intestinal',
    question: 'Você tem sintomas intestinais como distensão, constipação ou diarreia cíclica?',
    options: [
      { value: 'no', label: 'Não' },
      { value: 'yes', label: 'Sim' }
    ]
  },
  {
    id: 'urinary',
    question: 'Você sente ardência, urgência ou aumento da frequência urinária?',
    options: [
      { value: 'no', label: 'Não' },
      { value: 'yes', label: 'Sim' }
    ]
  },
  {
    id: 'emotional',
    question: 'Você se sente irritada ou ansiosa, especialmente durante o período menstrual?',
    options: [
      { value: 'no', label: 'Não' },
      { value: 'yes', label: 'Sim' }
    ]
  }
];

export default function Screening() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing screening results
  useEffect(() => {
    const checkExistingResults = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('screening_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data.profile);
          setAnswers(data.answers);
        }
      } catch (error) {
        console.error('Error fetching screening results:', error);
      }
    };

    checkExistingResults();
  }, [user?.id]);

  const handleAnswer = async (value: string) => {
    const questionId = questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setError(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Check if all questions are answered
      const allQuestionsAnswered = questions.every(q => newAnswers[q.id]);
      if (!allQuestionsAnswered) {
        setError('Por favor, responda todas as perguntas antes de continuar.');
        return;
      }

      setIsSubmitting(true);
      try {
        const determinedProfile = determineProfile(newAnswers);
        
        if (!user?.id) {
          throw new Error('Usuário não autenticado');
        }

        // Save to Supabase
        const { data, error: supabaseError } = await supabase
          .from('screening_results')
          .insert({
            user_id: user.id,
            profile: determinedProfile,
            answers: newAnswers,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw new Error(supabaseError.message);
        }

        if (!data) {
          throw new Error('Erro ao salvar os resultados');
        }

        // Show the result page
        setProfile(determinedProfile);
      } catch (error: any) {
        console.error('Error saving screening results:', error);
        setError(error.message || 'Erro ao salvar os resultados. Por favor, tente novamente.');
        setProfile(null);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const determineProfile = (answers: Record<string, string>) => {
    if (answers.pelvic_pain === 'often' || answers.pelvic_pain === 'always') {
      return 'pelvic';
    } else if (answers.intestinal === 'yes') {
      return 'intestinal';
    } else if (answers.urinary === 'yes') {
      return 'urinary';
    } else if (answers.emotional === 'yes') {
      return 'emotional';
    }
    return 'general';
  };

  const handleContinue = () => {
    router.push('/education');
  };

  if (profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
        <Card className="w-full max-w-2xl p-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-purple-900">Resultado da Triagem</h1>
            <p className="text-gray-600">
              Com base em suas respostas, identificamos um perfil {profile === 'pelvic' ? 'pélvico' : 
                profile === 'intestinal' ? 'intestinal' :
                profile === 'urinary' ? 'urinário' :
                profile === 'emotional' ? 'emocional' : 'geral'}.
            </p>
            <p className="text-gray-600">
              Vamos criar uma trilha educativa personalizada para você.
            </p>
            <button
              onClick={handleContinue}
              disabled={isSubmitting}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Salvando...' : 'Continuar para Educação'}
            </button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-purple-900">Triagem de Sintomas</h1>
          <p className="text-gray-600">
            Vamos entender melhor seus sintomas para criar uma experiência personalizada.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-800">
              {questions[currentQuestion].question}
            </h2>
            <Selector
              options={questions[currentQuestion].options}
              value={answers[questions[currentQuestion].id]}
              onChange={handleAnswer}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
              </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Pergunta {currentQuestion + 1} de {questions.length}
            </div>
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="text-purple-600 hover:text-purple-700"
              >
                Voltar
              </button>
            )}
          </div>
        </div>
      </Card>
    </main>
  );
} 