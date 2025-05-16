'use client'

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useUserStore } from '@/store/userStore';

interface FeedbackForm {
  rating: number;
  experience: string;
  suggestions: string;
  contact: string;
}

export default function Feedback() {
  const { profile } = useUserStore();
  const [formData, setFormData] = useState<FeedbackForm>({
    rating: 0,
    experience: '',
    suggestions: '',
    contact: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send feedback to backend
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
        <Card className="w-full max-w-2xl p-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-purple-900">Obrigada pelo seu feedback!</h1>
            <p className="text-gray-600">
              Sua opinião é muito importante para melhorarmos nossa plataforma.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Enviar novo feedback
            </button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-purple-900">Feedback</h1>
          <p className="text-gray-600">
            Sua opinião é muito importante para melhorarmos nossa plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-lg font-medium text-purple-800">
              Como você avalia sua experiência com a plataforma?
            </label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${
                    formData.rating === rating
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-purple-800">
              Conte-nos sobre sua experiência
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              rows={4}
              placeholder="O que você achou da plataforma? O que funcionou bem? O que poderia melhorar?"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-purple-800">
              Sugestões para melhorias
            </label>
            <textarea
              value={formData.suggestions}
              onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              rows={4}
              placeholder="Tem alguma sugestão para melhorarmos a plataforma?"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-purple-800">
              Email para contato (opcional)
            </label>
            <input
              type="email"
              value={formData.contact}
              onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Seu email para contato"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
          >
            Enviar Feedback
          </button>
        </form>
      </Card>
    </main>
  );
} 