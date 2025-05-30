'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Loader2, ArrowRight, ArrowLeft, Home, Clock, BookOpen, Award, Users, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useUserStore } from '@/store/userStore';
import { PageLayout } from '@/components/ui/page-layout';
import { Section } from '@/components/ui/section';

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
  const [showCompletion, setShowCompletion] = useState(false);
  const [moduleStartTime, setModuleStartTime] = useState<number>(Date.now());
  const [totalTimeSpent, setTotalTimeSpent] = useState<Record<number, number>>({});
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

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
        const completedModuleIds = new Set(completedData?.map((c: any) => c.module_id) || []);

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

        // Ensure currentModule is within bounds
        if (currentModule >= modulesWithStatus.length) {
          setCurrentModule(0);
        }
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
    if (!user?.id || !modules[currentModule] || currentModule >= modules.length) return;

    try {
      // Track time spent on current module
      trackModuleTime(currentModule);

      const currentModuleData = modules[currentModule];
      if (!currentModuleData?.id) {
        throw new Error('Módulo inválido');
      }

      // Check if module is already completed
      if (currentModuleData.completed) {
        // If already completed, just move to next module
        if (currentModule < modules.length - 1) {
          setCurrentModule(prev => prev + 1);
        } else {
          // All modules completed, redirect to feedback
          router.push('/feedback');
        }
        return;
      }

      // Mark module as completed in database with time tracking
      const timeSpent = totalTimeSpent[currentModule] || 0;
      const { error: completeError } = await supabase
        .from('completed_modules')
        .upsert({
          user_id: user.id,
          module_id: currentModuleData.id,
          completed_at: new Date().toISOString(),
          time_spent: timeSpent // Track time spent in milliseconds
        }, {
          onConflict: 'user_id,module_id'
        });

      if (completeError) {
        console.error('Database error:', completeError);
        throw new Error('Erro ao salvar progresso no banco de dados');
      }

      // Update local state
      setModules(prev => prev.map((module, index) =>
        index === currentModule ? { ...module, completed: true } : module
      ));

      // Move to next module or complete
      if (currentModule < modules.length - 1) {
        setCurrentModule(prev => prev + 1);
      } else {
        // All modules completed, show celebration
        setShowCompletion(true);
        // Don't automatically redirect - let user choose next step
      }
    } catch (error: any) {
      console.error('Error completing module:', error);
      setError(error.message || 'Erro ao marcar módulo como concluído. Por favor, tente novamente.');
    }
  };

  const handlePrevious = () => {
    if (currentModule > 0) {
      setCurrentModule(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentModule < modules.length - 1) {
      setCurrentModule(prev => prev + 1);
    }
  };

  const handleModuleSelect = (index: number) => {
    if (index >= 0 && index < modules.length) {
      setCurrentModule(index);
    }
  };

  // Time tracking functions
  const trackModuleTime = (moduleIndex: number) => {
    const timeSpent = Date.now() - moduleStartTime;
    setTotalTimeSpent(prev => ({
      ...prev,
      [moduleIndex]: (prev[moduleIndex] || 0) + timeSpent
    }));
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  // Reset module start time when module changes
  useEffect(() => {
    setModuleStartTime(Date.now());
  }, [currentModule]);

  // Update current time every second for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <PageLayout
        title="Carregando Módulos"
        subtitle="Preparando seu conteúdo educativo personalizado"
        gradient="from-purple-600 to-blue-600"
        containerPadding="sm"
      >
        <Section spacing="md" background="white">
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-300/20 rounded-full blur-xl animate-pulse"></div>
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 relative z-10" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-600 font-medium"
            >
              Carregando seus módulos educativos...
            </motion.p>
          </div>
        </Section>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Conteúdo Indisponível"
        subtitle="Vamos resolver isso rapidamente"
        gradient="from-red-600 to-purple-600"
        containerPadding="sm"
      >
        <Section spacing="md" background="white">
          <div className="py-12 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-md w-full"
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
                    className="text-xl font-semibold text-red-800"
                  >
                    Ops! Algo deu errado
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 text-center text-sm"
                  >
                    {error}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 w-full pt-4"
                >
                  <Button
                    onClick={() => router.push('/screening')}
                    variant="outline"
                    className="w-full border-purple-200 hover:bg-purple-50 transition-colors text-sm"
                  >
                    Refazer Triagem
                  </Button>
                  <Button
                    onClick={() => router.push('/support-group')}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-colors text-sm"
                  >
                    Ir para Grupos de Apoio
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  if (!modules.length) {
    return (
      <PageLayout
        title="Nenhum Módulo Disponível"
        subtitle="Vamos configurar seu conteúdo"
        gradient="from-yellow-600 to-purple-600"
        containerPadding="sm"
      >
        <Section spacing="md" background="white">
          <div className="py-12 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-md w-full"
            >
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-100 rounded-full blur-xl"></div>
                  <div className="bg-yellow-50 p-3 rounded-full relative z-10">
                    <AlertCircle className="h-10 w-10 text-yellow-500" />
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-semibold text-yellow-800"
                  >
                    Nenhum módulo disponível
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 text-center text-sm"
                  >
                    Não encontramos módulos educativos para o seu perfil. Por favor, entre em contato com o suporte
                    ou tente refazer a triagem.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 w-full pt-4"
                >
                  <Button
                    onClick={() => router.push('/screening')}
                    variant="outline"
                    className="w-full border-purple-200 hover:bg-purple-50 transition-colors text-sm"
                  >
                    Refazer Triagem
                  </Button>
                  <Button
                    onClick={() => router.push('/support-group')}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-colors text-sm"
                  >
                    Ir para Grupos de Apoio
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  const progress = (modules.filter(m => m.completed).length / modules.length) * 100;
  const allModulesCompleted = modules.length > 0 && modules.every(module => module.completed);

  // Show completion selection page if all modules are already completed (and not showing celebration)
  if (allModulesCompleted && !showCompletion) {
    return (
      <PageLayout
        title="Educação Concluída!"
        subtitle="Você já completou todos os módulos educativos"
        gradient="from-green-600 to-purple-600"
        containerPadding="sm"
      >
        <Section spacing="md" background="gradient">
          <div className="p-8 text-center space-y-8">
            <div className="text-6xl mb-4">🎓</div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-purple-800">
                Qual é o seu próximo passo?
              </h2>
              <p className="text-purple-700 max-w-2xl mx-auto leading-relaxed">
                Agora que você completou sua jornada educativa, escolha como gostaria de continuar
                sua experiência no EndoConnect.
              </p>
            </div>

            {/* Main Options */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Support Group Option */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                     onClick={() => router.push('/support-group')}>
                  <div className="text-center space-y-4">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-green-800">
                      Círculo Endo
                    </h3>
                    <p className="text-green-700 leading-relaxed text-sm">
                      Conecte-se com outras mulheres que compartilham experiências similares.
                      Participe de conversas seguras e receba suporte contínuo.
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
                      Entrar no Grupo de Apoio
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Feedback Option */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                     onClick={() => router.push('/feedback')}>
                  <div className="text-center space-y-4">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-purple-800">
                      Compartilhar Feedback
                    </h3>
                    <p className="text-purple-700 leading-relaxed text-sm">
                      Ajude-nos a melhorar o EndoConnect compartilhando sua experiência
                      com os módulos educativos.
                    </p>
                    <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 text-sm">
                      Dar Feedback
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional Options */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="pt-6 border-t border-purple-200"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setCurrentModule(0)}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 text-sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Revisar Módulos
                </Button>

                <Button
                  onClick={() => router.push('/')}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 text-sm"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              </div>
            </motion.div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  // Show completion celebration
  if (showCompletion) {
    return (
      <PageLayout
        title="🎉 Parabéns!"
        subtitle="Você completou todos os módulos educativos"
        gradient="from-green-600 to-emerald-600"
        containerPadding="sm"
      >
        <Section spacing="md" background="gradient">
          <div className="p-8 text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl"
            >
              🎓
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-green-800">
                Jornada Educativa Concluída!
              </h2>
              <p className="text-green-700 text-lg max-w-2xl mx-auto">
                Você demonstrou dedicação em aprender sobre a endometriose. Agora está preparada para
                conectar-se com outras mulheres e compartilhar suas experiências.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-4"
            >
              <Button
                onClick={() => router.push('/support-group')}
                size="lg"
                className="px-8 py-4 font-semibold bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 hover:from-green-700 hover:via-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Users className="mr-3 h-5 w-5" />
                Ir para Grupo de Apoio
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  // Main education interface
  return (
    <PageLayout
      title={`Módulo ${currentModule + 1}: ${modules[currentModule]?.title || 'Carregando...'}`}
      subtitle={`Progresso: ${Math.round(progress)}% completo`}
      gradient="from-purple-600 to-blue-600"
      containerPadding="sm"
    >
      <div className="space-y-6">
        {/* Progress Section */}
        <Section spacing="sm" background="white">
          <div className="p-4 space-y-4">
            {/* Progress info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Progress Badge */}
              <div className="bg-gradient-to-r from-purple-100 to-purple-50 px-3 py-2 rounded-full border border-purple-200">
                <span className="text-sm font-semibold text-purple-800">
                  {Math.round(progress)}% concluído
                </span>
              </div>

              {/* Time Tracking Display */}
              <div className="flex items-center space-x-2">
                <div className="bg-purple-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-purple-700">
                    Tempo: {formatTime((totalTimeSpent[currentModule] || 0) + (currentTime - moduleStartTime))}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progresso geral</span>
                <span className="text-sm font-medium text-purple-700">
                  {modules.filter(m => m.completed).length} de {modules.length} módulos
                </span>
              </div>
              <Progress
                value={progress}
                className="h-2 bg-purple-100 rounded-full overflow-hidden"
              />

              {/* Module Dots - Simplified */}
              <div className="flex justify-center space-x-2 pt-2">
                {modules.map((module, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleModuleSelect(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative group w-3 h-3 rounded-full transition-all duration-300 ${
                      module.completed
                        ? 'bg-green-500 hover:bg-green-600'
                        : index === currentModule
                          ? 'bg-purple-500 hover:bg-purple-600 ring-2 ring-purple-300'
                          : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    title={`Módulo ${index + 1}: ${module.title}`}
                  >
                    {module.completed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Module Content */}
        <Section spacing="sm" background="glass">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-6"
          >
            {/* Module Header */}
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-purple-900">
                    {modules[currentModule]?.title || 'Carregando...'}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Tempo: {formatTime(currentTime - moduleStartTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>Módulo {currentModule + 1}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {modules[currentModule]?.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full border border-green-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Concluído</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="prose prose-purple max-w-none prose-headings:text-purple-800 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-purple-700 prose-a:text-purple-600 hover:prose-a:text-purple-800 mb-6"
            >
              <div dangerouslySetInnerHTML={{ __html: modules[currentModule]?.content || '' }} />
            </motion.div>

            {/* Module Info Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-purple-100/50 pt-4"
            >
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-purple-100/50 p-3 rounded-lg border border-purple-100">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs font-semibold text-purple-800">Duração</p>
                  <p className="text-xs text-gray-600">{modules[currentModule]?.duration || 0} min</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100/50 p-3 rounded-lg border border-blue-100">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs font-semibold text-blue-800">Tipo</p>
                  <p className="text-xs text-gray-600">Educativo</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-green-100/50 p-3 rounded-lg border border-green-100">
                <Award className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs font-semibold text-green-800">Progresso</p>
                  <p className="text-xs text-gray-600">{Math.round(progress)}%</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-orange-100/50 p-3 rounded-lg border border-orange-100">
                <Award className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs font-semibold text-orange-800">Nível</p>
                  <p className="text-xs text-gray-600">Básico</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Section>

        {/* Navigation Section */}
        <Section spacing="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4"
          >
            {/* Navigation and Home Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="sm"
                className="border-purple-200 hover:bg-purple-50 transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                Início
              </Button>

              {currentModule > 0 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  size="sm"
                  className="border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
            </div>

            {/* Progress Info */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">
                Módulo {currentModule + 1} de {modules.length}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {currentModule < modules.length - 1 && !modules[currentModule]?.completed && (
                <Button
                  onClick={handleNext}
                  variant="outline"
                  size="sm"
                  className="border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  Pular
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              <Button
                onClick={handleComplete}
                size="sm"
                className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg px-6 py-3"
              >
                <span className="relative z-10 flex items-center font-medium">
                  {modules[currentModule]?.completed
                    ? (currentModule < modules.length - 1 ? 'Próximo' : 'Finalizar')
                    : (currentModule < modules.length - 1 ? 'Concluir e Próximo' : 'Concluir Curso')
                  }
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    {modules[currentModule]?.completed ? (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    )}
                  </motion.div>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </div>
          </motion.div>
        </Section>

        {/* Support Group Button - Show when all modules are completed */}
        {modules.every(module => module.completed) && (
          <Section spacing="sm" background="gradient">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="p-6"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="text-center space-y-6"
              >
                {/* Celebration Header */}
                <div className="flex justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-full shadow-md"
                  >
                    <Users className="w-8 h-8 text-green-600" />
                  </motion.div>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="text-xl font-bold text-green-800"
                  >
                    🎉 Parabéns! Você completou todos os módulos!
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="text-green-700 leading-relaxed"
                  >
                    Agora você pode se conectar com outras mulheres que compartilham experiências similares
                    no nosso grupo de apoio. Junte-se ao <strong>Círculo Endo</strong> e continue sua jornada
                    com o suporte de uma comunidade acolhedora.
                  </motion.p>
                </div>

                {/* Call to Action Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="pt-4"
                >
                  <Button
                    onClick={() => router.push('/support-group')}
                    size="lg"
                    className="px-8 py-4 font-semibold bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 hover:from-green-700 hover:via-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Ir para Grupo de Apoio - Círculo Endo
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </Section>
        )}
      </div>
    </PageLayout>
  );
}