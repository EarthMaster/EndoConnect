'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { ScreeningAnswers, RiskAssessment } from './types';
import { calculateRiskAssessment } from './utils/riskAssessment';
import { ScreeningProvider, useScreening } from './context/ScreeningContext';
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

    // Pain frequency
    switch (answers.pain_assessment) {
      case 'rarely': score += 1; break;
      case 'sometimes': score += 2; break;
      case 'frequently': score += 3; break;
      case 'always': score += 4; break;
    }

    // Pain intensity (0-10 scale)
    if (answers.pain_intensity) {
      score += Math.floor(answers.pain_intensity / 2);
    }

    // Pain duration
    if (answers.pain_duration) {
      score += parseInt(answers.pain_duration);
    }

    // Menstrual symptoms
    const menstrualSymptoms = answers.menstrual_symptoms || [];
    score += menstrualSymptoms.length;

    // Urinary symptoms
    const urinarySymptoms = answers.urinary_symptoms || [];
    score += urinarySymptoms.length;

    // Intestinal symptoms
    const intestinalSymptoms = answers.intestinal_symptoms || [];
    score += intestinalSymptoms.length;

    // Emotional symptoms
    const emotionalSymptoms = answers.emotional_symptoms || [];
    score += emotionalSymptoms.length;

    // Impact on daily life (0-10 scale)
    if (answers.impact) {
      score += Math.floor(answers.impact / 2);
    }

    return score;
  };

  const determineRiskLevel = (score: number): 'LOW' | 'MODERATE' | 'HIGH' => {
    if (score <= 5) return 'LOW';
    if (score <= 10) return 'MODERATE';
    return 'HIGH';
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-gray-600">Carregando sua triagem...</p>
      </motion.div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-red-600 text-center">{error}</p>
        <Button
          onClick={() => setError(null)}
          variant="outline"
          className="mt-4"
        >
          Tentar Novamente
        </Button>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const renderQuestionInput = () => {
    if (currentQuestion.type === 'scale') {
      return (
        <div className="space-y-4">
          <input
            type="range"
            min={currentQuestion.min}
            max={currentQuestion.max}
            step="1"
            value={answers[currentQuestion.id] || currentQuestion.min}
            onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{currentQuestion.min}</span>
            <span className="text-purple-600 font-medium">
              {answers[currentQuestion.id] || currentQuestion.min}
            </span>
            <span>{currentQuestion.max}</span>
          </div>
        </div>
      );
    }

    if (currentQuestion.type === 'multiple') {
      return (
        <div className="space-y-4">
          {currentQuestion.options?.map((option) => (
            <Button
              key={option.value}
              variant={answers[currentQuestion.id]?.includes(option.value) ? "default" : "outline"}
              className={`w-full justify-start text-left ${
                answers[currentQuestion.id]?.includes(option.value)
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "hover:bg-purple-50"
              }`}
              onClick={() => {
                const currentAnswers = answers[currentQuestion.id] || [];
                const newAnswers = currentAnswers.includes(option.value)
                  ? currentAnswers.filter((v: string) => v !== option.value)
                  : [...currentAnswers, option.value];
                handleAnswer(currentQuestion.id, newAnswers);
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {currentQuestion.options?.map((option) => (
          <Button
            key={option.value}
            variant={answers[currentQuestion.id] === option.value ? "default" : "outline"}
            className={`w-full justify-start text-left ${
              answers[currentQuestion.id] === option.value
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "hover:bg-purple-50"
            }`}
            onClick={() => handleAnswer(currentQuestion.id, option.value)}
          >
            {option.label}
          </Button>
        ))}
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
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-purple-900">
                Pergunta {currentStep + 1} de {questions.length}
              </h1>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% concluído
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-6">
              {currentQuestion.question}
            </h2>
            <p className="text-gray-600 mb-6">{currentQuestion.description}</p>
            {renderQuestionInput()}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!isAnswerValid() || isSubmitting}
              size="lg"
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processando...
                </>
              ) : currentStep === questions.length - 1 ? (
                'Concluir Triagem'
              ) : (
                'Próxima Pergunta'
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}