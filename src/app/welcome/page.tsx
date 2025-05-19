'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';
import { AlertCircle } from 'lucide-react';

export default function Welcome() {
  const router = useRouter();
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  const handleContinue = () => {
    if (agreed) {
      router.push('/screening');
    }
  };

  if (!user) {
    return null;
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
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="flex justify-center"
              >
                <Image
                  src="/logo.png"
                  alt="EndoConnect Logo"
                  width={180}
                  height={180}
                  priority
                  className="object-contain drop-shadow-md"
                />
              </motion.div>
              
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-purple-900 tracking-tight">
                  Bem-vinda ao EndoConnect
                </h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Estamos aqui para apoiar sua jornada com endometriose.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <Card className="bg-purple-50/50 p-6 border-purple-100">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-purple-800">
                      Termos de Uso e Privacidade
                    </h2>
                    <div className="space-y-4 text-gray-600">
                      <p className="leading-relaxed">
                        Ao continuar, você concorda com nossos termos de uso e política de privacidade.
                        Seus dados serão tratados com confidencialidade e segurança.
                      </p>
                      <p className="leading-relaxed">
                        O EndoConnect é uma plataforma de apoio e educação, não substituindo
                        consultas médicas ou tratamentos profissionais.
                      </p>
                      <p className="font-medium text-purple-800">
                        Ao usar nossa plataforma, você concorda em:
                      </p>
                      <ul className="grid gap-2 pl-5">
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          <span>Fornecer informações precisas e verdadeiras</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          <span>Manter a confidencialidade de sua conta</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          <span>Respeitar outros usuários e suas experiências</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          <span>Não compartilhar informações médicas pessoais sensíveis</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          <span>Usar a plataforma de acordo com as leis aplicáveis</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked: boolean) => setAgreed(checked)}
                  className="mt-1"
                />
                <label
                  htmlFor="agree"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  Eu li e concordo com os termos de uso e política de privacidade do EndoConnect.
                  Entendo que minhas informações serão tratadas com segurança e confidencialidade.
                </label>
              </div>

              <Button
                onClick={handleContinue}
                disabled={!agreed}
                className="w-full py-6 text-lg font-medium"
                size="lg"
              >
                Continuar minha jornada
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
} 