'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Info, Users, MessageSquare, Clock, Calendar, Video, Mic, MicOff, VideoOff } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystem: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
}

interface Session {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  host: string;
  topic: string;
  status: 'upcoming' | 'active' | 'completed';
}

export default function SessionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [showPseudonymDialog, setShowPseudonymDialog] = useState(true);
  const [pseudonym, setPseudonym] = useState('');
  const [usePseudonym, setUsePseudonym] = useState(false);

  useEffect(() => {
    // In a real application, this would fetch the session data from your backend
    const fetchSession = async () => {
      // Simulated API call
      const sessionData: Session = {
        id: params.id,
        title: 'Endometriosis Support Group',
        date: new Date('2024-03-15'),
        startTime: '19:00',
        endTime: '20:30',
        host: 'Dr. Sarah Johnson',
        topic: 'Managing Pain and Daily Life',
        status: 'active'
      };
      setSession(sessionData);

      // Simulated participants data
      setParticipants([
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          avatar: '/avatars/sarah.jpg',
          isHost: true,
          isMuted: false,
          isVideoOff: false,
        },
        {
          id: '2',
          name: 'Emily Chen',
          avatar: '/avatars/emily.jpg',
          isHost: false,
          isMuted: true,
          isVideoOff: false,
        },
        {
          id: '3',
          name: 'Maria Garcia',
          avatar: '/avatars/maria.jpg',
          isHost: false,
          isMuted: false,
          isVideoOff: true,
        },
      ]);
    };

    fetchSession();
  }, [params.id]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: usePseudonym ? pseudonym : 'You',
        content: newMessage,
        timestamp: new Date(),
        isSystem: false,
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleJoinSession = () => {
    if (usePseudonym && !pseudonym.trim()) {
      return; // Don't close dialog if pseudonym is required but empty
    }
    setShowPseudonymDialog(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const leaveSession = () => {
    router.push('/support-group/sessions');
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Dialog open={showPseudonymDialog} onOpenChange={setShowPseudonymDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Session</DialogTitle>
            <DialogDescription>
              You can choose to participate anonymously or use your name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="usePseudonym"
                checked={usePseudonym}
                onChange={(e) => setUsePseudonym(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="usePseudonym">Use a pseudonym</Label>
            </div>
            {usePseudonym && (
              <div className="space-y-2">
                <Label htmlFor="pseudonym">Choose your pseudonym</Label>
                <Input
                  id="pseudonym"
                  placeholder="Enter your pseudonym"
                  value={pseudonym}
                  onChange={(e) => setPseudonym(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleJoinSession}>
              Join Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto p-4 space-y-6">
        {/* Session Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{session.title}</h1>
            <p className="text-muted-foreground">
              {session.date.toLocaleDateString()} • {session.startTime} - {session.endTime}
            </p>
            <p className="text-sm text-muted-foreground">Topic: {session.topic}</p>
          </div>
          <Button variant="outline" onClick={leaveSession}>
            Leave Session
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video/Audio Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Video feed will appear here</p>
                </div>
              </div>
            </Card>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                variant={isVideoOff ? "destructive" : "outline"}
                size="icon"
                onClick={toggleVideo}
              >
                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Chat Section */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat</h2>
              <Badge variant="secondary">Live</Badge>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.isSystem ? 'items-center' : 'items-start'
                    }`}
                  >
                    {!message.isSystem && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {message.sender.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{message.sender}</span>
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        message.isSystem
                          ? 'bg-muted text-muted-foreground text-sm'
                          : 'bg-primary/10'
                      }`}
                    >
                      {message.content}
                    </div>
                    {!message.isSystem && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </Card>
        </div>

        {/* Participants Section */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Participants</h2>
            <Badge variant="secondary">{participants.length} Online</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted"
              >
                <Avatar>
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {participant.name}
                    {participant.isHost && (
                      <Badge variant="secondary" className="ml-2">Host</Badge>
                    )}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {participant.isMuted && (
                    <MicOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  {participant.isVideoOff && (
                    <VideoOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rules Alert */}
        {showRules && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Session Rules:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Respect privacy and confidentiality</li>
                  <li>Be kind and supportive</li>
                  <li>Share the floor - let others speak</li>
                  <li>No medical advice - share experiences only</li>
                  <li>Use the raise hand feature to speak</li>
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowRules(false)}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
} 