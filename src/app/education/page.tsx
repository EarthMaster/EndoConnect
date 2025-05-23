'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useUserStore } from '@/store/userStore';

interface EducationModule {
  id: string;
  title: string;
  content: string;
  order_index: number;
  completed: boolean;
  profile: string;
  duration: number;
}

export default function Education() {
  const router = useRouter();
  const { user } = useAuth();
  const storedProfile = useUserStore(state => state.profile);
  const setStoredProfile = useUserStore(state => state.setProfile);
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [currentModule, setCurrentModule] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndModules = async () => {
      if (!user?.id) return;

      try {
        // Use stored profile if available, otherwise fetch from database
        let userProfile: string;

        if (storedProfile) {
          userProfile = storedProfile;
          console.log('Using stored profile:', userProfile);
        } else {
          // First, get the user's profile from screening results
          const { data: profileData, error: profileError } = await supabase
            .from('screening_results')
            .select('profile')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            throw new Error('Erro ao carregar seu perfil de triagem');
          }

          if (!profileData) {
            setError('Nenhum resultado de triagem encontrado. Por favor, complete a triagem primeiro.');
            return;
          }

          userProfile = profileData.profile;

          // Save to Zustand store
          setStoredProfile(userProfile);
        }

        // Convert profile to uppercase to match education_modules table
        const profileUpperCase = userProfile.toUpperCase();

        console.log('Fetching modules for profile:', profileUpperCase);

        // Then, fetch modules for this profile
        let { data: modulesData, error: modulesError } = await supabase
          .from('education_modules')
          .select('*')
          .eq('profile', profileUpperCase)
          .order('order_index');


        console.log("modulesData", modulesData);
        
        if (modulesError) {
          console.error('Error fetching modules:', modulesError);
          throw new Error('Erro ao carregar os módulos educativos');
        }

        if (!modulesData || modulesData.length === 0) {
          console.error('No modules found for profile:', profileUpperCase);
          setError(`Não encontramos módulos educativos para o seu perfil (${userProfile}). Por favor, entre em contato com o suporte.`);
          return;
        }

        // Get completed modules for this user
        const { data: completedData, error: completedError } = await supabase
          .from('completed_modules')
          .select('module_id')
          .eq('user_id', user.id);

        if (completedError) {
          console.error('Error fetching completed modules:', completedError);
          throw new Error('Erro ao carregar o progresso dos módulos');
        }

        // Map modules with completion status
        const completedModuleIds = new Set(completedData?.map(c => c.module_id) || []);

        // Ensure modulesData is not null before mapping
        if (!modulesData) {
          console.error('modulesData is null after all attempts');
          throw new Error('Não foi possível carregar os módulos educativos');
        }

        const modulesWithStatus = modulesData.map(module => ({
          ...module,
          completed: completedModuleIds.has(module.id)
        }));

        setModules(modulesWithStatus);
      } catch (error: any) {
        console.error('Error in fetchProfileAndModules:', error);
        setError(error.message || 'Erro ao carregar seus módulos. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndModules();
  }, [user?.id, storedProfile, setStoredProfile]);

  const handleComplete = async () => {
    if (!user?.id || !modules[currentModule]) return;

    try {
      const { error: completeError } = await supabase
        .from('completed_modules')
        .insert({
          user_id: user.id,
          module_id: modules[currentModule].id,
          completed_at: new Date().toISOString()
        });

      if (completeError) throw completeError;

      setModules(prev => prev.map((module, index) =>
        index === currentModule ? { ...module, completed: true } : module
      ));

      if (currentModule < modules.length - 1) {
        setCurrentModule(prev => prev + 1);
      } else {
        // All modules completed, redirect to feedback
        router.push('/feedback');
      }
    } catch (error: any) {
      console.error('Error completing module:', error);
      setError('Erro ao marcar módulo como concluído. Por favor, tente novamente.');
    }
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
        <p className="text-gray-600">Carregando seus módulos educativos...</p>
      </motion.div>
    );
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
        <h2 className="text-xl font-semibold text-purple-900 mb-2">Conteúdo Indisponível</h2>
        <p className="text-gray-600 text-center max-w-md mb-4">{error}</p>
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            onClick={() => router.push('/screening')}
            variant="outline"
            className="mt-4"
          >
            Refazer Triagem
          </Button>
          <Button
            onClick={() => router.push('/support-group')}
            className="mt-4"
          >
            Ir para Grupos de Apoio
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!modules.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-purple-900">
          Nenhum módulo disponível
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Não encontramos módulos educativos para o seu perfil. Por favor, entre em contato com o suporte
          ou tente refazer a triagem.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={() => router.push('/screening')}
            variant="outline"
            className="mt-4"
          >
            Refazer Triagem
          </Button>
          <Button
            onClick={() => router.push('/support-group')}
            className="mt-4"
          >
            Ir para Grupos de Apoio
          </Button>
        </div>
      </motion.div>
    );
  }

  const progress = (modules.filter(m => m.completed).length / modules.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-900">
            Módulo {currentModule + 1} de {modules.length}
          </h1>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% concluído
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <motion.div
        key={currentModule}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 border-purple-100">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            {modules[currentModule].title}
          </h2>
          <div className="prose prose-purple max-w-none">
            {modules[currentModule].content}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Duração estimada: {modules[currentModule].duration} minutos
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleComplete}
          size="lg"
          className="w-full md:w-auto"
        >
          {currentModule < modules.length - 1 ? 'Próximo Módulo' : 'Concluir'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}