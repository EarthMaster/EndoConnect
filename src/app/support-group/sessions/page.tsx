'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MessageSquare, ArrowRight, Heart, Shield, Sparkles, Video, Mic, MessageSquarePlus, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/ui/page-layout';
import { MeetingCard } from '@/components/ui/meeting-card';
import { Input } from '@/components/ui/input';
import { Section } from '@/components/ui/section';

interface Session {
  id: string;
  title: string;
  schedule: string;
  time: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  category: string;
  format: string;
  duration: string;
  host: string;
  platform: string;
}

export default function SessionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      title: 'Círculo Endo Jovem',
      schedule: 'Segundas-feiras',
      time: '19h (horário de Brasília)',
      description: 'Um espaço seguro para mulheres jovens (18 a 30 anos) compartilharem vivências, desafios e apoio mútuo sobre endometriose. Mediação por psicóloga especializada em saúde da mulher.',
      maxParticipants: 15,
      currentParticipants: 8,
      status: 'upcoming',
      category: 'Jovens',
      format: 'Grupo de apoio',
      duration: '60 minutos',
      host: 'Dra. Ana Silva',
      platform: 'Zoom'
    },
    {
      id: '2',
      title: 'Convivendo com a Dor Crônica',
      schedule: 'Quartas-feiras',
      time: '18h30 (horário de Brasília)',
      description: 'Conversas sobre dor diária, saúde emocional e formas práticas de lidar com as crises. Você não está sozinha. Mediação por enfermeira especialista em dor crônica.',
      maxParticipants: 12,
      currentParticipants: 5,
      status: 'upcoming',
      category: 'Saúde',
      format: 'Grupo de apoio',
      duration: '60 minutos',
      host: 'Enf. Maria Santos',
      platform: 'Zoom'
    },
    {
      id: '3',
      title: 'Fertilidade e Planejamento Familiar',
      schedule: 'Quintas-feiras',
      time: '20h (horário de Brasília)',
      description: 'Discussões sobre dificuldades para engravidar, decisões reprodutivas e histórias de diferentes trajetórias com a endometriose. Mediação por ginecologista especialista em reprodução.',
      maxParticipants: 10,
      currentParticipants: 3,
      status: 'upcoming',
      category: 'Fertilidade',
      format: 'Grupo de apoio',
      duration: '60 minutos',
      host: 'Dra. Carla Mendes',
      platform: 'Zoom'
    },
    {
      id: '4',
      title: 'Trabalho e Endometriose',
      schedule: 'Sábados',
      time: '10h (horário de Brasília)',
      description: 'Grupo voltado para quem busca conciliar carreira, produtividade e autocuidado com os sintomas da doença. Mediação por psicóloga organizacional.',
      maxParticipants: 15,
      currentParticipants: 12,
      status: 'upcoming',
      category: 'Carreira',
      format: 'Grupo de apoio',
      duration: '60 minutos',
      host: 'Dra. Paula Costa',
      platform: 'Zoom'
    }
  ]);

  const categories = ['all', 'Jovens', 'Saúde', 'Fertilidade', 'Carreira'];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout
      title="Círculo Endo – Grupos de Apoio"
      subtitle="Encontre seu espaço de acolhimento e troca de experiências"
      gradient="from-purple-600 to-blue-600"
      containerPadding="sm"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <Section spacing="sm" background="white">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar grupos por nome ou tema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg border-gray-200 focus:border-purple-400"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full text-xs ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'hover:bg-purple-50'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Feature Highlights */}
        <Section spacing="sm">
          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
            {[
              { icon: Shield, text: "Espaço Seguro", color: "text-green-600" },
              { icon: Heart, text: "Apoio Mútuo", color: "text-pink-600" },
              { icon: Sparkles, text: "Experiências Compartilhadas", color: "text-purple-600" },
              { icon: Video, text: "Participação Anônima", color: "text-blue-600" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="font-medium text-gray-700 text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Sessions Grid */}
        <Section spacing="sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <MeetingCard
                  title={session.title}
                  host={session.host}
                  schedule={session.schedule}
                  time={session.time}
                  currentParticipants={session.currentParticipants}
                  maxParticipants={session.maxParticipants}
                  description={session.description}
                  category={session.category}
                  format={session.format}
                  duration={session.duration}
                  platform={session.platform}
                  disabled
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden mt-3 text-white border-0 rounded-xl py-2 shadow-md hover:shadow-lg text-sm"
                    disabled
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
                      Participar - em breve
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </MeetingCard>
              </motion.div>
            ))}
          </div>
        </Section>

        {filteredSessions.length === 0 && (
          <Section spacing="sm" background="white">
            <div className="text-center py-8">
              <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum grupo encontrado</h3>
              <p className="text-gray-600 text-sm">
                Tente ajustar seus filtros ou termo de busca para encontrar grupos disponíveis.
              </p>
            </div>
          </Section>
        )}

        {/* Call to Action */}
        <Section spacing="sm" background="gradient">
          <div className="p-6 text-center space-y-4">
            <h3 className="text-xl font-bold text-purple-800">Pronta para se conectar?</h3>
            <p className="text-purple-700 text-sm">
              Junte-se a outras mulheres que compartilham experiências similares e encontre o apoio que você merece.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => router.push('/support-group')}
            >
              Voltar para Regras e Consentimento
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Section>
      </div>
    </PageLayout>
  );
} 