'use client'

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // Get user's profile from screening results
        const { data: screeningData, error: screeningError } = await supabase
          .from('screening_results')
          .select('profile')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (screeningError) throw screeningError;

        const profile = screeningData?.profile || 'general';

        // Get education modules for the profile
        const { data: modulesData, error: modulesError } = await supabase
          .from('education_modules')
          .select('*')
          .eq('profile', profile)
          .order('order_index');

        if (modulesError) throw modulesError;

        setModules(modulesData || []);

        // Get completed modules
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

        // Check if all modules are completed
        if (completedModules.length + 1 === modules.length) {
          // Redirect to support group page
          router.push('/support-group');
        }
      } catch (error: any) {
        console.error('Error marking module as completed:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
        <Card className="w-full max-w-2xl p-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar o conteúdo: {error}</p>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-purple-900">Educação Personalizada</h1>
          <p className="text-gray-600">
            Conteúdo selecionado especialmente para você, baseado no seu perfil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className="cursor-pointer"
              onClick={() => handleModuleClick(module)}
            >
              <Card
                className={`p-6 transition-all hover:shadow-lg ${
                  completedModules.includes(module.id) ? 'bg-purple-50' : ''
                }`}
              >
          <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-purple-800">{module.title}</h2>
                    <span className="text-sm text-gray-500">{module.duration}</span>
                  </div>
                  <p className="text-gray-600">{module.content}</p>
                  {completedModules.includes(module.id) && (
                    <div className="text-sm text-green-600">✓ Concluído</div>
                  )}
                </div>
              </Card>
            </div>
          ))}
            </div>

        {selectedModule && (
          <Card className="p-6 mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-purple-800">{selectedModule.title}</h2>
              <div className="prose max-w-none text-gray-600">
                <p>{selectedModule.content}</p>
                <p>
                  Lembre-se de que o conhecimento é uma ferramenta poderosa no manejo da 
                  endometriose. Tire um tempo para absorver as informações e pratique as 
                  técnicas sugeridas regularmente.
                </p>
              </div>
            </div>
          </Card>
        )}
        </div>
    </main>
  );
} 