'use client'

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Calendar as CalendarIcon, Clock, Users, Video, Loader2, Heart, Shield, MessageCircle } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GroupSession {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  platform: 'google_meet' | 'zoom';
  meeting_link: string;
  max_participants: number;
  current_participants: number;
  facilitator: string;
  topics: string[];
}

interface UserProfile {
  pseudonym: string;
  topics_of_interest: string[];
  emergency_contact: string;
  agreed_to_rules: boolean;
  last_session_attended?: string;
}

export default function SupportGroup() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<GroupSession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [registrationData, setRegistrationData] = useState({
    pseudonym: '',
    topics: '',
    emergencyContact: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('group_sessions')
          .select('*')
          .gte('date', new Date().toISOString())
          .order('date');

        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);

        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        setUserProfile(profileData);

      } catch (error: any) {
        console.error('Error fetching support group data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleRegister = async () => {
    if (!user?.id) return;

    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          pseudonym: registrationData.pseudonym,
          topics_of_interest: registrationData.topics.split(',').map(t => t.trim()),
          emergency_contact: registrationData.emergencyContact,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      setShowRegistrationModal(false);
      setShowRulesModal(true);
    } catch (error: any) {
      console.error('Error registering for support group:', error);
      setError(error.message);
    }
  };

  const joinSession = async (sessionId: string) => {
    if (!user?.id || !userProfile) return;

    try {
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          pseudonym: userProfile.pseudonym
        });

      if (error) throw error;

      setSessions(prev => prev.map(session =>
        session.id === sessionId
          ? { ...session, current_participants: session.current_participants + 1 }
          : session
      ));

    } catch (error: any) {
      console.error('Error joining session:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Card className="max-w-4xl mx-auto p-6 md:p-8 shadow-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Carregando o Círculo Endo...</p>
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
              <Button onClick={() => window.location.reload()} variant="outline">
                Tentar novamente
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <PageLayout
      title="Círculo Endo"
      subtitle="Um espaço seguro para conversas sobre dor, saúde e coragem. Compartilhe experiências, receba apoio e construa conexões significativas."
      gradient="from-purple-600 to-pink-600"
    >
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="sessions" className="text-base">
                <MessageCircle className="w-4 h-4 mr-2" />
                Próximas Sessões
              </TabsTrigger>
              <TabsTrigger value="calendar" className="text-base">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="rules" className="text-base">
                <Shield className="w-4 h-4 mr-2" />
                Regras e Informações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group p-6 hover:shadow-lg transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-purple-800 group-hover:text-purple-900 transition-colors">
                              {session.title}
                            </h3>
                            <p className="text-gray-600 mt-1">{session.description}</p>
                          </div>
                          <Badge
                            variant={session.platform === 'google_meet' ? 'default' : 'secondary'}
                            className="flex items-center space-x-1"
                          >
                            <Video className="w-3 h-3" />
                            <span>{session.platform === 'google_meet' ? 'Google Meet' : 'Zoom'}</span>
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
                            {format(new Date(session.date), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-purple-500" />
                            {session.time}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            <span className="text-sm text-gray-600">
                              {session.current_participants}/{session.max_participants} participantes
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6 ring-2 ring-purple-100">
                              <img src="/facilitator-avatar.png" alt={session.facilitator} />
                            </Avatar>
                            <span className="text-sm text-gray-600">{session.facilitator}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {session.topics.map((topic, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-purple-50/50"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            onClick={() => joinSession(session.id)}
                            disabled={session.current_participants >= session.max_participants || !userProfile}
                            className="w-full"
                            size="lg"
                          >
                            {!userProfile ? (
                              <>
                                <Heart className="w-4 h-4 mr-2" />
                                Faça seu cadastro para participar
                              </>
                            ) : session.current_participants >= session.max_participants ? (
                              <>
                                <Users className="w-4 h-4 mr-2" />
                                Sessão Lotada
                              </>
                            ) : (
                              <>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Participar da Sessão
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <Card className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={ptBR}
                      className="mx-auto rounded-lg border shadow-sm"
                      modifiers={{
                        hasSessions: (date) => sessions.some(
                          session => format(new Date(session.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        )
                      }}
                      modifiersStyles={{
                        hasSessions: {
                          backgroundColor: 'rgba(147, 51, 234, 0.1)',
                          borderRadius: '50%',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-purple-100 mr-2" />
                        <span>Dias com sessões</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-800 mb-6">
                      Sessões em {format(selectedDate || new Date(), 'MMMM yyyy', { locale: ptBR })}
                    </h3>
                    <div className="space-y-4">
                      {sessions
                        .filter(session => format(new Date(session.date), 'yyyy-MM-dd') ===
                                format(selectedDate || new Date(), 'yyyy-MM-dd'))
                        .map(session => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="p-4 hover:shadow-md transition-shadow border-purple-100">
                              <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-purple-800">{session.title}</h4>
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm text-gray-600">{session.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4 text-purple-500" />
                                      <span className="text-sm text-gray-600">
                                        {session.current_participants}/{session.max_participants}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {session.topics.map((topic, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs bg-purple-50/50"
                                      >
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => joinSession(session.id)}
                                  disabled={session.current_participants >= session.max_participants}
                                  size="sm"
                                  className="border-purple-200 hover:bg-purple-50"
                                >
                                  {session.current_participants >= session.max_participants ? (
                                    'Lotado'
                                  ) : (
                                    'Participar'
                                  )}
                                </Button>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      {sessions
                        .filter(session => format(new Date(session.date), 'yyyy-MM-dd') ===
                                format(selectedDate || new Date(), 'yyyy-MM-dd')).length === 0 && (
                        <div className="text-center py-8">
                          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">
                          Nenhuma sessão agendada para esta data.
                        </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card className="p-6 md:p-8">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-semibold text-purple-800 mb-8">Regras do Grupo</h2>
                  <div className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="p-4 border-purple-100 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-purple-800">Confidencialidade</h3>
                              <p className="text-gray-600 mt-1">
                                O que é compartilhado no grupo, fica no grupo.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <Card className="p-4 border-purple-100 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-purple-800">Respeito Mútuo</h3>
                              <p className="text-gray-600 mt-1">
                                Respeite o tempo de fala e a experiência de cada participante.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Card className="p-4 border-purple-100 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <AlertCircle className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-purple-800">Conselhos Médicos</h3>
                              <p className="text-gray-600 mt-1">
                                Não ofereça conselhos médicos - compartilhe apenas experiências pessoais.
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Card className="p-6 bg-purple-50/50 border-purple-100">
                        <h3 className="font-semibold text-purple-800 mb-4">Recursos de Emergência</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-1">
                            <p className="font-medium text-purple-900">SAMU</p>
                            <p className="text-purple-800 text-2xl font-bold">192</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-purple-900">CVV</p>
                            <p className="text-purple-800 text-2xl font-bold">188</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-purple-900">Disque Saúde</p>
                            <p className="text-purple-800 text-2xl font-bold">136</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Registration Button */}
          {!userProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Button
                onClick={() => setShowRegistrationModal(true)}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Heart className="w-5 h-5 mr-2" />
                Quero participar do grupo
              </Button>
            </motion.div>
          )}

          {/* Registration Modal */}
          <AnimatePresence>
            {showRegistrationModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <Card className="w-full max-w-md p-6 md:p-8">
                    <h2 className="text-2xl font-semibold text-purple-800 mb-6">
                      Cadastro no Grupo
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pseudônimo
                        </label>
                        <Input
                          type="text"
                          value={registrationData.pseudonym}
                          onChange={(e) => setRegistrationData(prev => ({
                            ...prev,
                            pseudonym: e.target.value
                          }))}
                          placeholder="Como você gostaria de ser chamada?"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tópicos de Interesse
                        </label>
                        <Input
                          type="text"
                          value={registrationData.topics}
                          onChange={(e) => setRegistrationData(prev => ({
                            ...prev,
                            topics: e.target.value
                          }))}
                          placeholder="Ex: dor pélvica, fertilidade, tratamento hormonal"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contato de Emergência
                        </label>
                        <Input
                          type="text"
                          value={registrationData.emergencyContact}
                          onChange={(e) => setRegistrationData(prev => ({
                            ...prev,
                            emergencyContact: e.target.value
                          }))}
                          placeholder="Nome e telefone de alguém para contato em caso de emergência"
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button
                          onClick={() => setShowRegistrationModal(false)}
                          variant="outline"
                          className="w-32"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleRegister}
                          className="w-32"
                        >
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rules Confirmation Modal */}
          <AnimatePresence>
            {showRulesModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <Card className="w-full max-w-md p-6 md:p-8">
                    <h2 className="text-2xl font-semibold text-purple-800 mb-6">
                      Confirmação das Regras
                    </h2>
                    <div className="space-y-6">
                      <p className="text-gray-600">
                        Ao participar do grupo, você concorda em:
                      </p>
                      <ul className="space-y-4">
                        {[
                          'Manter a confidencialidade das informações compartilhadas',
                          'Respeitar o tempo de fala de cada participante',
                          'Não oferecer conselhos médicos',
                          'Usar linguagem respeitosa e inclusiva',
                          'Manter o foco no tema da sessão'
                        ].map((rule, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 text-gray-600"
                          >
                            <Shield className="w-5 h-5 text-purple-500 flex-shrink-0" />
                            <span>{rule}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="flex justify-end">
                        <Button
                          onClick={() => setShowRulesModal(false)}
                          size="lg"
                        >
                          <Shield className="w-5 h-5 mr-2" />
                          Concordo e Quero Participar
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Disclaimers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4 text-sm text-gray-500"
          >
            <p>
              Este grupo não substitui cuidados médicos ou psicológicos profissionais.
              Em caso de emergência, procure atendimento médico imediatamente.
            </p>
            <p>
              Para mais informações sobre privacidade e proteção de dados, consulte nossa{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                Política de Privacidade
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
}