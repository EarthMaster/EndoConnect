'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const questions = [
  {
    id: 'pelvic_pain',
    question: 'Com que frequência você sente dor pélvica?',
    description: 'Considere a frequência da dor na região pélvica nos últimos 3 meses.',
    options: [
      { value: 'rarely', label: 'Raramente', description: 'Menos de uma vez por mês' },
      { value: 'sometimes', label: 'Às vezes', description: '1-2 vezes por mês' },
      { value: 'often', label: 'Frequentemente', description: 'Semanalmente' },
      { value: 'always', label: 'Sempre', description: 'Quase todos os dias' }
    ]
  },
  {
    id: 'intestinal',
    question: 'Você tem sintomas intestinais como distensão, constipação ou diarreia cíclica?',
    description: 'Estes sintomas podem estar relacionados ao seu ciclo menstrual.',
    options: [
      { value: 'no', label: 'Não', description: 'Não tenho estes sintomas' },
      { value: 'yes', label: 'Sim', description: 'Tenho um ou mais destes sintomas' }
    ]
  },
  {
    id: 'urinary',
    question: 'Você sente ardência, urgência ou aumento da frequência urinária?',
    description: 'Especialmente durante o período menstrual.',
    options: [
      { value: 'no', label: 'Não', description: 'Não tenho estes sintomas' },
      { value: 'yes', label: 'Sim', description: 'Tenho um ou mais destes sintomas' }
    ]
  },
  {
    id: 'emotional',
    question: 'Você se sente irritada ou ansiosa, especialmente durante o período menstrual?',
    description: 'Considere mudanças emocionais significativas que afetam sua rotina.',
    options: [
      { value: 'no', label: 'Não', description: 'Não sinto alterações significativas' },
      { value: 'yes', label: 'Sim', description: 'Sinto alterações emocionais importantes' }
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing screening results
  useEffect(() => {
    const checkExistingResults = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('screening_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setProfile(null);
          } else {
            throw error;
          }
        } else if (data) {
          setProfile(data.profile);
          setAnswers(data.answers);
        }
      } catch (error: any) {
        console.error('Error fetching screening results:', error);
        setError('Erro ao carregar resultados anteriores. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingResults();
  }, [user?.id]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  const handleAnswer = async (value: string) => {
    const questionId = questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setError(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Carregando sua triagem...</p>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-600 text-center">{error}</p>
              <Button
                onClick={() => setError(null)}
                variant="outline"
                className="mt-4"
              >
                Tentar Novamente
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                </motion.div>
                
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-purple-900">
                    Triagem Concluída
                  </h1>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    Com base em suas respostas, identificamos um perfil{' '}
                    <span className="font-medium text-purple-800">
                      {profile === 'pelvic' ? 'pélvico' : 
                       profile === 'intestinal' ? 'intestinal' :
                       profile === 'urinary' ? 'urinário' :
                       profile === 'emotional' ? 'emocional' : 'geral'}.
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Vamos criar uma trilha educativa personalizada para você.
                  </p>
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg font-medium"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Continuar para Educação'
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-purple-900">
                  Triagem de Sintomas
                </h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Vamos entender melhor seus sintomas para criar uma experiência personalizada.
                </p>
              </div>

              <div className="space-y-2">
                <Progress
                  value={((currentQuestion + 1) / questions.length) * 100}
                  className="h-2"
                />
                <p className="text-sm text-gray-500 text-right">
                  Pergunta {currentQuestion + 1} de {questions.length}
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-purple-800">
                      {questions[currentQuestion].question}
                    </h2>
                    <p className="text-gray-600">
                      {questions[currentQuestion].description}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {questions[currentQuestion].options.map((option) => (
                      <Button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        variant={answers[questions[currentQuestion].id] === option.value ? "default" : "outline"}
                        className="w-full p-4 h-auto flex flex-col items-start text-left"
                      >
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
} 