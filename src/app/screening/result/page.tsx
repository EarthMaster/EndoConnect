'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ScreeningResult() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-purple-900">Resultado da Triagem</h1>
          <p className="text-gray-600">
            Com base em suas respostas, você pode estar enfrentando sintomas compatíveis com endometriose.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">
              Trilha Educativa Recomendada
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium text-purple-700">Módulo 1 – O que é endometriose?</h3>
                <p className="text-gray-600 mt-2">
                  Entenda o que acontece no seu corpo e como essa condição pode se manifestar.
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium text-purple-700">Módulo 2 – Como lidar com a dor pélvica crônica?</h3>
                <p className="text-gray-600 mt-2">
                  Orientações práticas e estratégias de autocuidado.
                </p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-medium text-purple-700">Módulo 3 – Saúde mental e endometriose</h3>
                <p className="text-gray-600 mt-2">
                  Impactos emocionais, ansiedade e como buscar suporte.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => window.location.href = '/education'}
            >
              Ir para Trilha
            </Button>
            <Button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() => window.location.href = '/support-group'}
            >
              Conhecer Grupo de Apoio
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
} 