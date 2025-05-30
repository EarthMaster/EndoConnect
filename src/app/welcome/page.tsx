'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useAuth } from '@/providers/AuthProvider';
import { BookOpen, Lock, Heart, Users, Shield, Sparkles, ArrowRight, CheckCircle, Star, Brain, Activity } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';
import { Section } from '@/components/ui/section';

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
      containerPadding="sm"
    >
      <div className="space-y-6">
        {/* Hero Statistics */}
        <Section spacing="sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Users, count: "10%", label: "das mulheres têm endometriose", color: "purple" },
              { icon: Brain, count: "7 anos", label: "tempo médio para diagnóstico", color: "blue" },
              { icon: Heart, count: "200M", label: "mulheres afetadas mundialmente", color: "pink" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <Card className="p-4 text-center bg-gradient-to-br from-white to-purple-50/50 hover:from-purple-50 hover:to-white transition-all duration-300 shadow-md hover:shadow-lg border-2 border-transparent hover:border-purple-200">
                  <div className="mx-auto w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-1">{stat.count}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Platform Features */}
        <Section spacing="sm" background="gradient">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-blue-700 bg-clip-text text-transparent mb-3">
                O que oferecemos para você
              </h2>
              <p className="text-gray-600">Ferramentas baseadas em evidências científicas para sua jornada de autoconhecimento</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Activity, title: "Triagem Inteligente", description: "Questionário científico personalizado", color: "purple" },
                { icon: BookOpen, title: "Educação Interativa", description: "Conteúdo médico acessível", color: "blue" },
                { icon: Users, title: "Grupos de Apoio", description: "Conexão com outras mulheres", color: "pink" },
                { icon: Shield, title: "Dados Seguros", description: "Privacidade garantida", color: "green" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="group text-center"
                >
                  <div className="w-12 h-12 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-purple-800 mb-2 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Glossary Section */}
        <Section spacing="sm" background="glass">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-2 rounded-xl shadow-md">
                <BookOpen className="w-6 h-6 text-purple-700" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-blue-700 bg-clip-text text-transparent">
                Glossário Introdutório
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Para facilitar sua experiência, apresentamos alguns termos médicos em linguagem acessível:
            </p>

            <div className="grid gap-4">
              {[
                {
                  term: "Endometriose",
                  definition: "Condição em que o tecido semelhante ao revestimento do útero cresce fora dele, podendo causar dor e outros sintomas.",
                  icon: "🔬"
                },
                {
                  term: "Dismenorreia",
                  definition: "Dor menstrual intensa que pode interferir significativamente nas atividades diárias e qualidade de vida.",
                  icon: "📅"
                },
                {
                  term: "Dispareunia",
                  definition: "Dor durante ou após relações sexuais, que pode afetar a intimidade e relacionamentos.",
                  icon: "💕"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
                  className="group cursor-pointer"
                >
                  <Card className="p-4 rounded-xl border-2 border-transparent hover:border-purple-200 transition-all duration-300 bg-gradient-to-r from-white to-purple-50/30 hover:shadow-md hover:scale-[1.02]">
                    <div className="flex items-start space-x-3">
                      <div className="text-xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-purple-800 mb-1 text-sm">{item.term}</h3>
                        <p className="text-gray-600 leading-relaxed text-xs">{item.definition}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Consent Section */}
        <Section spacing="sm" background="white">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-xl shadow-md">
                <Shield className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-800 bg-clip-text text-transparent">
                Termo de Consentimento Científico
              </h2>
            </div>

            <div className="space-y-4 text-gray-700">
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
                className="bg-gradient-to-r from-white to-blue-50/50 p-4 rounded-xl border-2 border-blue-100 shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <p className="font-bold text-blue-800 mb-4">
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                      className="group"
                    >
                      <Card className="p-3 rounded-lg border-2 border-transparent hover:border-blue-200 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 hover:shadow-sm">
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="font-medium text-sm">{item}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Checkbox */}
            <motion.div
              className="bg-gradient-to-r from-white to-purple-50/50 p-4 rounded-xl border-2 border-purple-100 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked: boolean) => setAgreed(checked)}
                  className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <label
                  htmlFor="agree"
                  className="text-gray-700 leading-relaxed cursor-pointer font-medium text-sm"
                >
                  Eu li e concordo com o termo de consentimento científico do EndoConnect.
                  Entendo que minhas informações serão tratadas de forma anônima e segura para apoiar pesquisas científicas.
                </label>
              </div>
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
                className={`w-full py-4 text-base font-bold relative overflow-hidden group ${!agreed ? 'opacity-70' : ''} bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl`}
                size="lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Concordo e Quero Começar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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
                <Heart className="w-4 h-4 mr-2 text-pink-500" />
                <p className="text-xs text-gray-500">
                  Seus dados estão protegidos de acordo com a LGPD
                </p>
              </div>
            </motion.div>
          </div>
        </Section>
      </div>
    </PageLayout>
  );
}