import { Card } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Calendar, Users, Mic, Clock, Video, Hash, Layers } from 'lucide-react';
import { ReactNode } from 'react';

interface MeetingCardProps {
  title: string;
  host: string;
  schedule: string;
  time: string;
  currentParticipants: number;
  maxParticipants: number;
  description: string;
  category: string;
  format: string;
  duration: string;
  platform: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

export function MeetingCard({
  title,
  host,
  schedule,
  time,
  currentParticipants,
  maxParticipants,
  description,
  category,
  format,
  duration,
  platform,
  disabled,
  onClick,
  children,
}: MeetingCardProps) {
  return (
    <Card
      className="group relative flex flex-col justify-between min-h-[420px] max-h-[480px] h-full overflow-hidden border-2 border-transparent hover:border-primary/80 transition-all duration-300 shadow-md hover:shadow-2xl bg-white rounded-2xl p-0 transform-gpu hover:scale-[1.025]"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {/* Category Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge 
          variant="secondary" 
          className="text-xs font-medium px-3 py-1 bg-purple-100 text-purple-700 border border-purple-200 shadow"
        >
          <Hash className="w-3 h-3 mr-1 inline-block" />
          {category}
        </Badge>
      </div>
      <div className="flex flex-col flex-1 p-8 pb-0">
        {/* Title and Host */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors duration-300 mb-1">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Mic className="w-4 h-4 text-primary" />
            <span>Mediação: {host}</span>
          </div>
        </div>
        {/* Session Details */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6 text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
            </span>
            <div>
              <span className="font-medium text-gray-900">{schedule}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <Users className="w-4 h-4 text-blue-600" />
            </span>
            <div>
              <span className="font-medium text-gray-900">
                {currentParticipants}/{maxParticipants}
              </span>
              <p className="text-xs text-muted-foreground">participantes</p>
            </div>
          </div>
          {/* Time Badge */}
          <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-blue-600 text-white flex items-center gap-1 shadow">
            <Clock className="w-3 h-3 mr-1 inline-block" />
            {time}
          </Badge>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-100 my-2" />
        {/* Description */}
        <p className="text-muted-foreground leading-relaxed text-sm flex-1 mb-4">
          {description}
        </p>
        {/* Spacer to push badges and button to bottom */}
        <div className="flex-1" />
        {/* Session Info Badges */}
        <div className="flex flex-wrap gap-2 pt-2 mb-4">
          <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <Layers className="w-3 h-3 mr-1 inline-block" />
            {format}
          </Badge>
          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="w-3 h-3 mr-1 inline-block" />
            {duration}
          </Badge>
          <Badge variant="outline" className="text-xs bg-indigo-100 text-indigo-800 border-indigo-200 flex items-center gap-1">
            <Video className="w-3 h-3 mr-1 inline-block" />
            {platform}
          </Badge>
        </div>
      </div>
      {/* Button always at the bottom */}
      <div className="p-8 pt-0 flex items-end">
        {children}
      </div>
    </Card>
  );
} 