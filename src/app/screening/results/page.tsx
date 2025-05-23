'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useUserStore } from '@/store/userStore';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight, Info } from 'lucide-react';

interface ScreeningResult {
  profile: string;
  answers: Record<string, any>;
  created_at: string;
}

export default function ScreeningResults() {
  const router = useRouter();
  const { user } = useAuth();
  const storedProfile = useUserStore(state => state.profile);
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScreeningResults = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to use stored profile first
        if (storedProfile) {
          // We have the profile but need to get the full results for display
          const { data, error } = await supabase
            .from('screening_results')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;
          setResult(data);
        } else {
          // No stored profile, fetch from database
          const { data, error } = await supabase
            .from('screening_results')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;
          
          if (!data) {
            // No results found, redirect to screening
            router.push('/screening');
            return;
          }
          
          setResult(data);
        }
      } catch (error: any) {
        console.error('Error fetching screening results:', error);
        setError('Erro ao carregar seus resultados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScreeningResults();
  }, [user?.id, router, storedProfile]);

  const handleContinue = () => {
    router.push('/education');
  };

  const getRiskLevelColor = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW':
        return 'bg-green-500';
      case 'MODERATE':
        return 'bg-yellow-500';
      case 'HIGH':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskLevelText = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW':
        return 'Baixo';
      case 'MODERATE':
        return 'Moderado';
      case 'HIGH':
        return 'Alto';
      default:
        return 'Indeterminado';
    }
  };

  const getRecommendations = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW':
        return [
          'Mantenha um diário de sintomas',
          'Agende uma consulta de rotina com seu ginecologista',
          'Pratique exercícios físicos regularmente'
        ];
      case 'MODERATE':
        return [
          'Agende uma consulta com especialista em endometriose',
          'Considere iniciar um plano de exercícios específico',
          'Mantenha um registro detalhado dos sintomas',
          'Explore opções de manejo da dor'
        ];
      case 'HIGH':
        return [
          'Procure atendimento médico imediatamente',
          'Considere buscar um centro especializado em endometriose',
          'Inicie um plano de manejo da dor com seu médico',
          'Considere terapia psicológica para suporte emocional'
        ];
      default:
        return ['Consulte um médico para avaliação'];
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-gray-600">Carregando seus resultados...</p>
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-red-600 text-center">{error}</p>
            <Button
              onClick={() => router.push('/screening')}
              variant="outline"
              className="mt-4"
            >
              Voltar para Triagem
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <Info className="h-12 w-12 text-purple-500" />
            <p className="text-gray-600 text-center">Nenhum resultado de triagem encontrado.</p>
            <Button
              onClick={() => router.push('/screening')}
              variant="outline"
              className="mt-4"
            >
              Iniciar Triagem
            </Button>
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
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-900 mb-4">
              Resultados da sua Triagem
            </h1>
            <p className="text-gray-600">
              Com base nas suas respostas, avaliamos seu perfil de risco para endometriose.
            </p>
          </div>

          <Card className="p-6 md:p-8 shadow-lg">
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getRiskLevelColor(result.profile)} text-white`}>
                  <span className="text-2xl font-bold">{getRiskLevelText(result.profile)}</span>
                </div>
                <h2 className="text-xl font-semibold text-center">
                  Seu nível de risco é <span className="text-purple-800">{getRiskLevelText(result.profile)}</span>
                </h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-purple-800">Recomendações Imediatas:</h3>
                <ul className="space-y-2">
                  {getRecommendations(result.profile).map((recommendation, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-2"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{recommendation}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  Estes resultados são baseados nas suas respostas e servem como um guia inicial.
                  Não substituem uma avaliação médica profissional.
                </p>
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="w-full"
                >
                  Continuar para Conteúdo Educativo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
