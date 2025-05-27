'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useAuth } from '@/providers/AuthProvider';
import { BookOpen, Lock, Heart } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';

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
    <PageLayout
      title="Bem-vinda ao EndoConnect"
      subtitle="Estamos aqui para ajudar você a entender seus sintomas e aprender mais sobre a saúde ginecológica. Sua jornada de conhecimento sobre endometriose começa aqui."
      gradient="from-purple-600 to-blue-600"
    >
      <div className="space-y-8">

          {/* Glossary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="p-6 md:p-8 shadow-xl rounded-2xl border-purple-100/50 backdrop-blur-sm bg-white/90 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl -mr-10 -mt-10 z-0"></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-purple-800">
                    Glossário Introdutório
                  </h2>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  Para facilitar sua experiência, apresentamos alguns termos médicos em linguagem acessível:
                </p>

                <div className="grid gap-4">
                  {[
                    {
                      term: "Endometriose",
                      definition: "Condição em que o tecido semelhante ao revestimento do útero cresce fora dele.",
                      delay: 1.0
                    },
                    {
                      term: "Dismenorreia",
                      definition: "Dor menstrual intensa que pode interferir nas atividades diárias.",
                      delay: 1.1
                    },
                    {
                      term: "Dispareunia",
                      definition: "Dor durante ou após relações sexuais.",
                      delay: 1.2
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4 bg-white/80 p-4 rounded-xl shadow-sm border border-purple-50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: item.delay, duration: 0.4 }}
                    >
                      <span className="w-3 h-3 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-purple-800">{item.term}:</span>
                        <span className="text-gray-600 ml-1">{item.definition}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Consent Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Card className="p-6 md:p-8 shadow-xl rounded-2xl border-blue-100/50 backdrop-blur-sm bg-white/90 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100/30 rounded-full blur-2xl -ml-10 -mt-10 z-0"></div>
              <div className="relative z-10 space-y-6">

                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-purple-800">
                    Termo de Consentimento Científico
                  </h2>
                </div>

                <div className="space-y-4 text-gray-600">
                  <motion.p
                    className="leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                  >
                    Seus dados serão utilizados de forma anônima e segura para apoiar pesquisas científicas.
                    Você pode revogar este consentimento a qualquer momento.
                  </motion.p>

                  <motion.p
                    className="leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                  >
                    O EndoConnect é uma plataforma de apoio e educação, não substituindo
                    consultas médicas ou tratamentos profissionais.
                  </motion.p>

                  <motion.div
                    className="bg-white/90 p-5 rounded-xl border border-blue-100 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                  >
                    <p className="font-medium text-purple-800 mb-4">
                      Ao usar nossa plataforma, você concorda com:
                    </p>
                    <div className="space-y-3">
                      {[
                        "O uso anônimo de seus dados para fins de pesquisa científica",
                        "A confidencialidade e segurança no tratamento de suas informações",
                        "Os princípios da LGPD (Lei Geral de Proteção de Dados)"
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + index * 0.1, duration: 0.3 }}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Checkbox */}
                <motion.div
                  className="flex items-start space-x-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                >
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
                    Eu li e concordo com o termo de consentimento científico do EndoConnect.
                    Entendo que minhas informações serão tratadas de forma anônima e segura para apoiar pesquisas científicas.
                  </label>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                >
                  <Button
                    onClick={handleContinue}
                    disabled={!agreed}
                    className={`w-full py-6 text-lg font-medium relative overflow-hidden group ${!agreed ? 'opacity-70' : ''}`}
                    size="lg"
                  >
                    <span className="relative z-10">Concordo e Quero Começar</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                </motion.div>

                {/* Footer */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.9, duration: 0.5 }}
                >
                  <div className="flex justify-center items-center text-purple-600">
                    <Heart className="w-4 h-4 mr-1 text-pink-500" />
                    <p className="text-xs text-gray-500">
                      Seus dados estão protegidos de acordo com a LGPD
                    </p>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
      </div>
    </PageLayout>
  );
}