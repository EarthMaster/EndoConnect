'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/providers/AuthProvider';
import { useUserStore } from '@/store/userStore';
import { Loader2, ArrowRight, Info, BookOpen } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';

interface ScreeningResult {
  id: string;
  user_id: string;
  profile: string;
  answers: any;
  created_at: string;
}

export default function ScreeningResults() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, setProfile } = useUserStore();
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user?.id) {
        router.push('/signin');
        return;
      }

      try {
        // Simulate API call - replace with actual implementation
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock result - replace with actual data fetching
        const mockResult: ScreeningResult = {
          id: '1',
          user_id: user.id,
          profile: profile || 'MODERATE',
          answers: {},
          created_at: new Date().toISOString()
        };

        setResult(mockResult);
        setProfile(mockResult.profile);
      } catch (error: any) {
        setError(error.message || 'Erro ao carregar resultados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [user?.id, router, profile, setProfile]);

  const getRiskLevelText = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW': return 'Baixo Risco';
      case 'MODERATE': return 'Risco Moderado';
      case 'HIGH': return 'Alto Risco';
      default: return 'Risco Indeterminado';
    }
  };

  const getRiskLevelEmoji = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW': return '😊';
      case 'MODERATE': return '😐';
      case 'HIGH': return '😟';
      default: return '❓';
    }
  };

  const getRiskLevelColor = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW': return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case 'MODERATE': return 'bg-gradient-to-br from-orange-500 to-orange-600';
      case 'HIGH': return 'bg-gradient-to-br from-red-500 to-red-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const getRiskLevelBgColor = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW': return 'bg-blue-50';
      case 'MODERATE': return 'bg-orange-50';
      case 'HIGH': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const getRiskLevelBorderColor = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW': return 'border-blue-200';
      case 'MODERATE': return 'border-orange-200';
      case 'HIGH': return 'border-red-200';
      default: return 'border-gray-200';
    }
  };

  const getRiskDescription = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW':
        return 'Seus sintomas sugerem baixa probabilidade de endometriose. Continue monitorando sua saúde.';
      case 'MODERATE':
        return 'Seus sintomas podem indicar endometriose. Recomendamos consulta médica para avaliação.';
      case 'HIGH':
        return 'Seus sintomas são consistentes com endometriose. Consulte um especialista o quanto antes.';
      default:
        return 'Não foi possível determinar seu nível de risco com base nas respostas fornecidas.';
    }
  };

  const getRiskLevelGradient = (profile: string) => {
    switch (profile?.toUpperCase()) {
      case 'LOW': return 'from-blue-600 to-blue-500';
      case 'MODERATE': return 'from-orange-600 to-orange-500';
      case 'HIGH': return 'from-red-600 to-red-500';
      default: return 'from-gray-600 to-gray-500';
    }
  };

  const handleContinue = () => {
    router.push('/education');
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Carregando Resultados"
        subtitle="Analisando suas respostas e preparando seus resultados personalizados..."
        gradient="from-purple-600 to-blue-600"
      >
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-300/20 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 relative z-10" />
          </div>
          <p className="text-gray-600 font-medium text-lg">
            Processando sua triagem...
          </p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Erro nos Resultados"
        subtitle={error}
        gradient="from-red-600 to-red-500"
      >
        <div className="text-center space-y-6 py-12">
          <Button
            onClick={() => router.push('/screening')}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-colors"
          >
            Voltar para Triagem
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (!result) {
    return (
      <PageLayout
        title="Nenhum Resultado Encontrado"
        subtitle="Você ainda não completou a triagem. Vamos começar sua avaliação personalizada!"
        gradient="from-purple-600 to-blue-600"
      >
        <div className="text-center space-y-6 py-12">
          <Button
            onClick={() => router.push('/screening')}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-colors"
          >
            Iniciar Triagem
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={`Resultado: ${getRiskLevelText(result.profile)}`}
      subtitle="Com base nas suas respostas, nossa análise inteligente avaliou seu perfil de risco para endometriose."
      gradient={getRiskLevelGradient(result.profile)}
    >
      <div className="space-y-6">
        {/* Simplified Risk Level Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`${getRiskLevelBgColor(result.profile)} ${getRiskLevelBorderColor(result.profile)} border p-6 rounded-2xl text-center`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getRiskLevelColor(result.profile)} text-white shadow-lg`}>
              <div className="text-center">
                <div className="text-4xl mb-1">{getRiskLevelEmoji(result.profile)}</div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {getRiskLevelText(result.profile)}
              </h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                {getRiskDescription(result.profile)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100 text-center"
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-full">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">
                Próximo Passo: Educação Personalizada
              </h3>
              <p className="text-gray-700 max-w-md mx-auto mb-4">
                Continue sua jornada com conteúdo educativo personalizado para seu perfil de risco.
              </p>
            </div>
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Iniciar Módulos Educativos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 text-sm">Aviso Importante</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Este resultado é uma avaliação inicial. Não substitui uma consulta médica profissional.
                Para diagnóstico definitivo, sempre consulte um especialista.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
