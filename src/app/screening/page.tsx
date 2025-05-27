'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from '@/providers/AuthProvider';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { questions } from './types/questions';
import { useUserStore } from '@/store/userStore';

export default function Screening() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const setProfile = useUserStore(state => state.setProfile);
  const setScreeningAnswers = useUserStore(state => state.setScreeningAnswers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          // Redirect to results page if screening is already completed
          router.push('/screening/results');
          return;
        }
      } catch (error: any) {
        console.error('Error fetching screening results:', error);
        setError('Erro ao carregar resultados anteriores. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingResults();
  }, [user?.id, router, supabase]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep === questions.length - 1) {
      await handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Calculate risk assessment
      const riskScore = calculateRiskScore(answers);
      const riskLevel = determineRiskLevel(riskScore);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      if (!riskLevel) {
        throw new Error('Nível de risco não pode ser determinado');
      }

      // Save to local state with Zustand
      setProfile(riskLevel);
      setScreeningAnswers(answers);

      // Submit results to Supabase
      const { error } = await supabase
        .from('screening_results')
        .insert({
          user_id: user.id,
          profile: riskLevel, // Store risk level as profile
          answers: answers
        });

      if (error) throw error;

      // Redirect to results page instead of directly to education
      router.push('/screening/results');
    } catch (error) {
      console.error('Error submitting screening:', error);
      setError('Erro ao salvar os resultados. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateRiskScore = (answers: Record<string, any>) => {
    let score = 0;

    // 1. Frequência da dor pélvica (0-3 pontos)
    switch (answers.pelvic_pain_frequency) {
      case 'never': score += 0; break;
      case 'rarely': score += 0; break;
      case 'sometimes': score += 1; break;
      case 'frequently': score += 2; break;
      case 'always': score += 3; break;
    }

    // 2. Localização da dor (múltiplas localizações = maior pontuação)
    const painLocations = answers.pain_location || [];
    if (painLocations.length >= 3) score += 2;
    else if (painLocations.length >= 1) score += 1;

    // 3. Piora durante o período menstrual (0-3 pontos)
    switch (answers.menstrual_pain_worsening) {
      case 'no': score += 0; break;
      case 'mild': score += 1; break;
      case 'moderate': score += 2; break;
      case 'severe': score += 3; break;
    }

    // 4. Presença de dispareunia (0-3 pontos)
    switch (answers.dyspareunia) {
      case 'never': score += 0; break;
      case 'rarely': score += 0; break;
      case 'sometimes': score += 1; break;
      case 'frequently': score += 2; break;
      case 'always': score += 3; break;
    }

    // 5. Sintomas intestinais cíclicos (0-3 pontos)
    const intestinalSymptoms = answers.intestinal_symptoms || [];
    if (intestinalSymptoms.length >= 3) score += 3;
    else if (intestinalSymptoms.length >= 2) score += 2;
    else if (intestinalSymptoms.length >= 1) score += 1;

    // 6. Sintomas urinários cíclicos (0-3 pontos)
    const urinarySymptoms = answers.urinary_symptoms || [];
    if (urinarySymptoms.length >= 3) score += 3;
    else if (urinarySymptoms.length >= 2) score += 2;
    else if (urinarySymptoms.length >= 1) score += 1;

    return score;
  };

  const determineRiskLevel = (score: number): 'LOW' | 'MODERATE' | 'HIGH' => {
    if (score <= 4) return 'LOW';      // 0-4: Baixo risco sintomático
    if (score <= 8) return 'MODERATE'; // 5-8: Risco moderado
    return 'HIGH';                     // 9+: Alto risco sugestivo
  };

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-100 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col items-center justify-center space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-purple-300/20 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 relative z-10" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 font-medium text-lg"
          >
            Carregando sua triagem...
          </motion.p>
        </motion.div>
      </motion.main>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-100 flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 p-8 max-w-md w-full"
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-xl"></div>
              <div className="bg-red-50 p-3 rounded-full relative z-10">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>

            <div className="space-y-3">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-semibold text-purple-900"
              >
                Erro na Triagem
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-center"
              >
                {error}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full pt-4"
            >
              <Button
                onClick={() => setError(null)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-colors"
              >
                Tentar Novamente
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.main>
    );
  }

  const currentQuestion = questions[currentStep];

  const renderQuestionInput = () => {
    if (currentQuestion.type === 'scale') {
      const currentValue = answers[currentQuestion.id] || currentQuestion.min;
      return (
        <div className="space-y-6">
          <div className="relative">
            <input
              type="range"
              min={currentQuestion.min}
              max={currentQuestion.max}
              step="1"
              value={currentValue}
              onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg appearance-none cursor-pointer slider"
              aria-label={`Escala de ${currentQuestion.min} a ${currentQuestion.max}`}
            />
            <div className="absolute top-0 left-0 w-full h-3 pointer-events-none">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg transition-all duration-300"
                style={{ width: `${((currentValue - (currentQuestion.min || 0)) / ((currentQuestion.max || 10) - (currentQuestion.min || 0))) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">{currentQuestion.min}</span>
            <div className="bg-purple-100 px-4 py-2 rounded-full">
              <span className="text-purple-700 font-bold text-lg">
                {currentValue}
              </span>
            </div>
            <span className="text-gray-500 font-medium">{currentQuestion.max}</span>
          </div>
        </div>
      );
    }

    if (currentQuestion.type === 'multiple') {
      return (
        <div className="grid gap-3">
          {currentQuestion.options?.map((option, index) => {
            const isSelected = answers[currentQuestion.id]?.includes(option.value);
            return (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left p-4 h-auto transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-600 shadow-md hover:from-purple-700 hover:to-purple-600"
                      : "hover:bg-purple-50 hover:border-purple-300 border-gray-200"
                  }`}
                  onClick={() => {
                    const currentAnswers = answers[currentQuestion.id] || [];
                    const newAnswers = currentAnswers.includes(option.value)
                      ? currentAnswers.filter((v: string) => v !== option.value)
                      : [...currentAnswers, option.value];
                    handleAnswer(currentQuestion.id, newAnswers);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-white bg-white"
                        : "border-gray-300"
                    }`}>
                      {isSelected && (
                        <CheckCircle2 className="w-3 h-3 text-purple-600" />
                      )}
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="grid gap-3">
        {currentQuestion.options?.map((option, index) => {
          const isSelected = answers[currentQuestion.id] === option.value;
          return (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Button
                variant="outline"
                className={`w-full justify-start text-left p-4 h-auto transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-600 shadow-md hover:from-purple-700 hover:to-purple-600"
                    : "hover:bg-purple-50 hover:border-purple-300 border-gray-200"
                }`}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? "border-white bg-white"
                      : "border-gray-300"
                  }`}>
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-purple-600" />
                    )}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const isAnswerValid = () => {
    if (!answers[currentQuestion.id]) return false;
    if (currentQuestion.type === 'multiple') {
      return (answers[currentQuestion.id] as string[]).length > 0;
    }
    return true;
  };

  return (
    <PageLayout
      title={`Pergunta ${currentStep + 1} de ${questions.length}`}
      subtitle={currentQuestion.question}
      gradient="from-purple-600 to-blue-600"
    >
      <div className="space-y-8">
        {/* Question Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {currentQuestion.description}
          </p>
        </motion.div>

        {/* Question Input Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 p-6 md:p-8 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-40 h-40 bg-purple-100/30 rounded-full blur-2xl -ml-10 -mt-10 z-0"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {renderQuestionInput()}
            </motion.div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={handleNext}
            disabled={!isAnswerValid() || isSubmitting}
            size="lg"
            className={`px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
              !isAnswerValid() || isSubmitting
                ? 'opacity-50 cursor-not-allowed bg-gray-400'
                : 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 hover:from-purple-700 hover:via-purple-600 hover:to-blue-600 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-3 h-6 w-6" />
                Processando...
              </>
            ) : currentStep === questions.length - 1 ? (
              <>
                <CheckCircle2 className="mr-3 h-6 w-6" />
                Concluir Triagem
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="ml-3 h-6 w-6" />
                </motion.div>
              </>
            ) : (
              <>
                Próxima Pergunta
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="ml-3 h-6 w-6" />
                </motion.div>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
}