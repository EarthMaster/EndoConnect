'use client'

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScreeningLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function ScreeningLayout({ children, currentStep, totalSteps }: ScreeningLayoutProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 text-right">
                Pergunta {currentStep + 1} de {totalSteps}
              </p>
            </div>
            {children}
          </div>
        </Card>
      </div>
    </main>
  );
} 