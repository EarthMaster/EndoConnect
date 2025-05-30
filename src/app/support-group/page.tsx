'use client'

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Heart, Shield, Users, Video, Calendar, Clock, MessageCircle, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';
import { Section } from '@/components/ui/section';

interface GroupRules {
  title: string;
  description: string;
}

const groupRules: GroupRules[] = [
  {
    title: "Respeito mútuo e escuta empática",
    description: "Valorizamos o respeito e a escuta ativa entre todas as participantes."
  },
  {
    title: "Proibição de discurso ofensivo",
    description: "Não são permitidos discursos ofensivos, médico-centrados ou capacitistas."
  },
  {
    title: "Sem conselhos médicos",
    description: "Não é permitido dar conselhos médicos ou fazer diagnósticos."
  },
  {
    title: "Mediação ativa",
    description: "O grupo conta com mediação profissional para garantir um ambiente seguro."
  }
];

const suggestedTopics = [
  {
    title: "Lidando com a dor diária",
    description: "Estratégias práticas para gerenciar dor crônica e manter qualidade de vida"
  },
  {
    title: "Relacionamentos e endometriose",
    description: "Como a condição afeta relacionamentos pessoais e familiares"
  },
  {
    title: "Saúde mental e autocuidado",
    description: "Cuidando do bem-estar emocional e mental durante o tratamento"
  }
];

export default function SupportGroup() {
  const router = useRouter();
  const { user } = useAuth();
  const [showRules, setShowRules] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [agreedToConsent, setAgreedToConsent] = useState(false);

  const handleJoinGroup = () => {
    if (!agreedToRules || !agreedToConsent) {
      setShowRules(true);
      return;
    }
    router.push('/support-group/sessions');
  };

  return (
    <PageLayout
      title="Círculo Endo – Conversas sobre Dor, Saúde e Coragem"
      subtitle="Aqui você encontra escuta, informação e conexão com outras mulheres que entendem o que você sente."
      gradient="from-purple-600 to-pink-600"
      containerPadding="sm"
    >
      <div className="space-y-6">
        {/* Statistics Section */}
        <Section spacing="sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Users, count: "500+", label: "Participantes ativas" },
              { icon: Video, count: "50+", label: "Sessões realizadas" },
              { icon: Star, count: "4.9", label: "Avaliação média" }
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
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Introduction Card */}
        <Section spacing="sm" background="glass">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-2 rounded-xl shadow-md">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-700 bg-clip-text text-transparent">
                Sobre o Círculo Endo
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed">
              O Círculo Endo é um espaço digital seguro e acolhedor para mulheres com sintomas sugestivos de endometriose.
              Aqui, você encontrará um ambiente mediado por profissionais de saúde, onde poderá compartilhar experiências,
              receber apoio emocional e construir conexões significativas com outras mulheres que compreendem sua jornada.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Video className="w-5 h-5 text-purple-600" />,
                  title: "Encontros Virtuais",
                  description: "Sessões semanais ou quinzenais via Zoom ou Jitsi",
                  color: "purple"
                },
                {
                  icon: <Calendar className="w-5 h-5 text-blue-600" />,
                  title: "Horários Flexíveis",
                  description: "Escolha entre sessões pela manhã, tarde ou noite",
                  color: "blue"
                },
                {
                  icon: <MessageCircle className="w-5 h-5 text-pink-600" />,
                  title: "Participação Anônima",
                  description: "Use pseudônimo e participe com câmera e microfone opcionais",
                  color: "pink"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="group cursor-pointer"
                >
                  <Card className="p-4 rounded-xl border-2 border-transparent hover:border-purple-200 transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-md hover:scale-105">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 rounded-lg bg-purple-100 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-purple-800 text-sm">{feature.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Topics Card */}
        <Section spacing="sm" background="gradient">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-2 rounded-xl shadow-md">
                <MessageCircle className="w-6 h-6 text-pink-700" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-purple-800 bg-clip-text text-transparent">
                Temas dos Encontros
              </h2>
            </div>

            <div className="grid gap-4">
              {suggestedTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="group cursor-pointer"
                >
                  <Card className="p-4 rounded-xl border-2 border-transparent hover:border-pink-200 transition-all duration-300 bg-white/80 hover:shadow-md hover:scale-[1.02]">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-pink-800 mb-1 text-sm">{topic.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{topic.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Rules and Consent Card */}
        <Section spacing="sm" background="white">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-2 rounded-xl shadow-md">
                <Shield className="w-6 h-6 text-purple-700" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-700 bg-clip-text text-transparent">
                Regras e Consentimento
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4">
                {groupRules.map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <Card className="p-4 rounded-xl border-2 border-transparent hover:border-purple-200 transition-all duration-300 bg-gradient-to-r from-white to-purple-50/30 hover:shadow-md">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-2 h-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-purple-800 mb-1 text-sm">{rule.title}</h3>
                          <p className="text-xs text-gray-600 leading-relaxed">{rule.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="bg-gradient-to-r from-white to-purple-50/50 p-4 rounded-xl border-2 border-purple-100 shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="rules"
                      checked={agreedToRules}
                      onCheckedChange={(checked: boolean) => setAgreedToRules(checked)}
                      className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <label
                      htmlFor="rules"
                      className="text-gray-700 leading-relaxed cursor-pointer font-medium text-sm"
                    >
                      Eu li e concordo com as regras de convivência do Círculo Endo.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={agreedToConsent}
                      onCheckedChange={(checked: boolean) => setAgreedToConsent(checked)}
                      className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <label
                      htmlFor="consent"
                      className="text-gray-700 leading-relaxed cursor-pointer font-medium text-sm"
                    >
                      Declaro estar ciente de que este espaço é de apoio emocional e troca entre usuárias.
                      Não substitui atendimento médico ou psicológico. Comprometo-me com as regras de
                      convivência e proteção mútua.
                    </label>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <Button
                  onClick={handleJoinGroup}
                  disabled={!agreedToRules || !agreedToConsent}
                  className={`w-full py-4 text-base font-bold relative overflow-hidden group ${(!agreedToRules || !agreedToConsent) ? 'opacity-70' : ''} bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl`}
                  size="lg"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Quero participar do grupo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="flex justify-center items-center text-purple-600">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  <p className="text-xs text-gray-500">
                    Seus dados estão protegidos de acordo com a LGPD
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>
      </div>
    </PageLayout>
  );
}