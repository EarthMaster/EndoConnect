'use client'

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useUserStore } from '@/store/userStore';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  reported?: boolean;
}

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  schedule: string;
  participants: number;
  messages: Message[];
  rules: string[];
  moderators: string[];
  isJoined: boolean;
}

const supportGroups: SupportGroup[] = [
  {
    id: '1',
    name: 'Grupo de Apoio - Dor Pélvica',
    description: 'Um espaço seguro para compartilhar experiências e estratégias de manejo da dor pélvica.',
    schedule: 'Toda terça-feira, 19:00',
    participants: 15,
    moderators: ['mod1', 'mod2'],
    isJoined: false,
    rules: [
      'Respeite todos os participantes',
      'Não compartilhe informações médicas pessoais',
      'Mantenha o foco no tema do grupo',
      'Use linguagem apropriada'
    ],
    messages: [
      {
        id: '1',
        user: 'Maria',
        content: 'Olá! Alguém tem dicas para lidar com a dor durante o período menstrual?',
        timestamp: new Date('2024-03-16T14:00:00')
      },
      {
        id: '2',
        user: 'Ana',
        content: 'Eu tenho usado compressas quentes e exercícios de respiração. Tem ajudado bastante!',
        timestamp: new Date('2024-03-16T14:05:00')
      }
    ]
  },
  {
    id: '2',
    name: 'Grupo de Apoio - Saúde Emocional',
    description: 'Foco em bem-estar emocional e estratégias de autocuidado.',
    schedule: 'Toda quinta-feira, 20:00',
    participants: 12,
    moderators: ['mod3', 'mod4'],
    isJoined: false,
    rules: [
      'Mantenha um ambiente acolhedor',
      'Respeite a privacidade dos outros',
      'Compartilhe experiências de forma construtiva',
      'Busque ajuda profissional quando necessário'
    ],
    messages: [
      {
        id: '1',
        user: 'Joana',
        content: 'Como vocês lidam com a ansiedade relacionada à endometriose?',
        timestamp: new Date('2024-03-16T15:00:00')
      },
      {
        id: '2',
        user: 'Carla',
        content: 'Meditação e terapia têm me ajudado muito. Também mantenho um diário para registrar meus sentimentos.',
        timestamp: new Date('2024-03-16T15:10:00')
      }
    ]
  }
];

export default function SupportGroup() {
  const { profile } = useUserStore();
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleJoinGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .insert([
          {
            user_id: user?.id,
            group_id: groupId,
            joined_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Update local state
      const updatedGroups = supportGroups.map(group => 
        group.id === groupId 
          ? { ...group, isJoined: true, participants: group.participants + 1 }
          : group
      );
      setSelectedGroup(updatedGroups.find(g => g.id === groupId) || null);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .match({ user_id: user?.id, group_id: groupId });

      if (error) throw error;

      // Update local state
      const updatedGroups = supportGroups.map(group => 
        group.id === groupId 
          ? { ...group, isJoined: false, participants: group.participants - 1 }
          : group
      );
      setSelectedGroup(updatedGroups.find(g => g.id === groupId) || null);
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleReportMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('reported_messages')
        .insert([
          {
            message_id: messageId,
            user_id: user?.id,
            reason: reportReason,
            reported_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      setReportReason('');
      // Update message in local state
      if (selectedGroup) {
        const updatedMessages = selectedGroup.messages.map(msg =>
          msg.id === messageId ? { ...msg, reported: true } : msg
        );
        setSelectedGroup({ ...selectedGroup, messages: updatedMessages });
      }
    } catch (error) {
      console.error('Error reporting message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const message: Message = {
      id: Date.now().toString(),
      user: user?.email || 'Você',
      content: newMessage,
      timestamp: new Date()
    };

    try {
      const { error } = await supabase
        .from('group_messages')
        .insert([
          {
            group_id: selectedGroup.id,
            user_id: user?.id,
            content: newMessage,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Update local state
      selectedGroup.messages.push(message);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="w-full max-w-6xl space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-purple-900">Grupos de Apoio</h1>
          <p className="text-gray-600">
            Conecte-se com outras mulheres que compartilham experiências similares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportGroups.map((group) => (
            <div
              key={group.id}
              className="cursor-pointer"
              onClick={() => setSelectedGroup(group)}
            >
              <Card className="p-6 hover:shadow-lg transition-all">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-purple-800">{group.name}</h2>
                  <p className="text-gray-600">{group.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Horário: {group.schedule}</span>
                    <span>{group.participants} participantes</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      group.isJoined ? handleLeaveGroup(group.id) : handleJoinGroup(group.id);
                    }}
                    className={`w-full py-2 rounded-lg ${
                      group.isJoined
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {group.isJoined ? 'Sair do Grupo' : 'Participar do Grupo'}
                  </button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {selectedGroup && (
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-purple-800">{selectedGroup.name}</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowRules(!showRules)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {showRules ? 'Ocultar Regras' : 'Ver Regras'}
                  </button>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Voltar
                  </button>
                </div>
              </div>

              {showRules && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">Regras do Grupo</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {selectedGroup.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                {selectedGroup.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.user === user?.email
                        ? 'bg-purple-100 ml-auto'
                        : 'bg-white'
                    } max-w-[80%]`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-purple-800">{message.user}</div>
                      {!message.reported && message.user !== user?.email && (
                        <button
                          onClick={() => handleReportMessage(message.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Reportar
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700">{message.content}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                    {message.reported && (
                      <div className="text-xs text-red-600 mt-1">
                        Esta mensagem foi reportada
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedGroup.isJoined && (
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Enviar
                  </button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </main>
  );
} 