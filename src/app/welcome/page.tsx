'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';

export default function Welcome() {
  const router = useRouter();
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      router.push('/screening');
    }
  };

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="EndoConnect Logo"
              width={150}
              height={150}
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-purple-900">Bem-vinda ao EndoConnect</h1>
          <p className="text-gray-600">
            Estamos aqui para apoiar sua jornada com endometriose.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">
              Termos de Uso e Privacidade
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Ao continuar, você concorda com nossos termos de uso e política de privacidade.
                Seus dados serão tratados com confidencialidade e segurança.
              </p>
              <p>
                O EndoConnect é uma plataforma de apoio e educação, não substituindo
                consultas médicas ou tratamentos profissionais.
              </p>
              <p>
                Ao usar nossa plataforma, você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Fornecer informações precisas e verdadeiras</li>
                <li>Manter a confidencialidade de sua conta</li>
                <li>Respeitar outros usuários e suas experiências</li>
                <li>Não compartilhar informações médicas pessoais sensíveis</li>
                <li>Usar a plataforma de acordo com as leis aplicáveis</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="agree" className="text-gray-700">
              Eu li e concordo com os termos de uso e política de privacidade
            </label>
          </div>

          <button
            onClick={handleContinue}
            disabled={!agreed}
            className={`w-full py-3 rounded-lg text-white ${
              agreed
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continuar
          </button>
        </div>
      </Card>
    </main>
  );
} 