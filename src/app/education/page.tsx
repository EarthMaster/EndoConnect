'use client'

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Book, Clock, CheckCircle, AlertCircle, Loader2, Users } from 'lucide-react';

interface EducationModule {
  id: string;
  profile: string;
  title: string;
  content: string;
  duration: string;
  order_index: number;
}

export default function Education() {
  const { user } = useAuth();
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<EducationModule | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isAllModulesCompleted = completedModules.length === modules.length;
  const progress = modules.length > 0 ? (completedModules.length / modules.length) * 100 : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const { data: screeningData, error: screeningError } = await supabase
          .from('screening_results')
          .select('profile')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (screeningError) throw screeningError;

        const profile = screeningData?.profile || 'general';

        const { data: modulesData, error: modulesError } = await supabase
          .from('education_modules')
          .select('*')
          .eq('profile', profile)
          .order('order_index');

        if (modulesError) throw modulesError;

        setModules(modulesData || []);

        const { data: completedData, error: completedError } = await supabase
          .from('completed_modules')
          .select('module_id')
          .eq('user_id', user.id);

        if (completedError) throw completedError;

        setCompletedModules(completedData?.map(c => c.module_id) || []);
      } catch (error: any) {
        console.error('Error fetching education data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleModuleClick = async (module: EducationModule) => {
    setSelectedModule(module);
    
    if (!completedModules.includes(module.id)) {
      try {
        const { error } = await supabase
          .from('completed_modules')
          .insert({
            user_id: user?.id,
            module_id: module.id,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;

        setCompletedModules(prev => [...prev, module.id]);
      } catch (error: any) {
        console.error('Error marking module as completed:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Card className="max-w-4xl mx-auto p-6 md:p-8 shadow-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Carregando seu conteúdo personalizado...</p>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Card className="max-w-4xl mx-auto p-6 md:p-8 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-600 text-center">Erro ao carregar o conteúdo: {error}</p>
              <Button
                onClick={() => window.location.reload()}
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-900">
              Educação Personalizada
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conteúdo selecionado especialmente para você, baseado no seu perfil.
            </p>

            <div className="max-w-md mx-auto space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{completedModules.length} de {modules.length} módulos concluídos</span>
                <span>{Math.round(progress)}% completo</span>
              </div>
            </div>

            <Button
              onClick={() => router.push('/support-group')}
              disabled={!isAllModulesCompleted}
              className="mt-4"
              size="lg"
            >
              <Users className="w-5 h-5 mr-2" />
              {isAllModulesCompleted
                ? 'Ir para Grupo de Apoio'
                : 'Complete todos os módulos para acessar o grupo'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`group relative p-6 transition-all hover:shadow-lg cursor-pointer ${
                    completedModules.includes(module.id)
                      ? 'bg-purple-50/50 border-purple-200'
                      : ''
                  }`}
                  onClick={() => handleModuleClick(module)}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <Book className="w-5 h-5 text-purple-600 mt-1" />
                        <div>
                          <h2 className="text-xl font-semibold text-purple-800 group-hover:text-purple-900">
                            {module.title}
                          </h2>
                          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{module.duration}</span>
                          </div>
                        </div>
                      </div>
                      {completedModules.includes(module.id) && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2">{module.content}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedModule && (
              <motion.div
                key={selectedModule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 md:p-8 shadow-lg border-purple-100">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Book className="w-6 h-6 text-purple-600 mt-1" />
                        <div>
                          <h2 className="text-2xl font-semibold text-purple-800">
                            {selectedModule.title}
                          </h2>
                          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{selectedModule.duration}</span>
                          </div>
                        </div>
                      </div>
                      {completedModules.includes(selectedModule.id) && (
                        <div className="flex items-center space-x-2 text-green-500">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Concluído</span>
                        </div>
                      )}
                    </div>

                    <div className="prose max-w-none text-gray-600">
                      <p className="leading-relaxed">{selectedModule.content}</p>
                      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-sm text-purple-800">
                          Lembre-se de que o conhecimento é uma ferramenta poderosa no manejo da 
                          endometriose. Tire um tempo para absorver as informações e pratique as 
                          técnicas sugeridas regularmente.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setSelectedModule(null)}
                        variant="outline"
                      >
                        Voltar para Módulos
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
} 