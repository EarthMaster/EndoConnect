'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Star, Send, Heart, MessageCircle, Lightbulb, Mail, Home, CheckCircle2 } from 'lucide-react';
import { PageLayout } from '@/components/ui/page-layout';

interface FeedbackForm {
  rating: number;
  experience: string;
  suggestions: string;
  contact: string;
}

export default function Feedback() {
  const router = useRouter();
  const [formData, setFormData] = useState<FeedbackForm>({
    rating: 0,
    experience: '',
    suggestions: '',
    contact: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Send feedback to backend
      console.log('Feedback submitted:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (submitted) {
    return (
      <PageLayout
        title="Obrigada pelo seu feedback!"
        subtitle="Sua opinião é muito importante para melhorarmos nossa plataforma e ajudar mais mulheres."
        gradient="from-green-600 to-emerald-600"
      >
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              size="lg"
              className="border-purple-200 hover:bg-purple-50 transition-colors"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Enviar novo feedback
            </Button>

            <Button
              onClick={() => router.push('/')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-colors"
            >
              <Home className="mr-2 h-5 w-5" />
              Voltar ao Início
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center items-center text-purple-600"
          >
            <Heart className="w-4 h-4 mr-1 text-pink-500" />
            <p className="text-sm text-gray-500">
              Juntas, fazemos a diferença na saúde feminina
            </p>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Compartilhe sua Experiência"
      subtitle="Sua opinião é muito importante para melhorarmos nossa plataforma e ajudar mais mulheres a entender e lidar com a endometriose."
      gradient="from-purple-600 to-blue-600"
    >

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* Rating Section */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center space-x-3">
                  <Star className="h-6 w-6 text-purple-600" />
                  <label className="text-xl font-semibold text-purple-800">
                    Como você avalia sua experiência com a plataforma?
                  </label>
                </div>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {[
                    { value: 1, emoji: '😢', label: 'Muito insatisfeita', color: 'from-red-500 to-red-400', hoverColor: 'hover:border-red-400 hover:bg-red-50', bgColor: 'bg-red-50' },
                    { value: 2, emoji: '😞', label: 'Insatisfeita', color: 'from-orange-500 to-orange-400', hoverColor: 'hover:border-orange-400 hover:bg-orange-50', bgColor: 'bg-orange-50' },
                    { value: 3, emoji: '😐', label: 'Neutra', color: 'from-yellow-500 to-yellow-400', hoverColor: 'hover:border-yellow-400 hover:bg-yellow-50', bgColor: 'bg-yellow-50' },
                    { value: 4, emoji: '😊', label: 'Satisfeita', color: 'from-green-500 to-green-400', hoverColor: 'hover:border-green-400 hover:bg-green-50', bgColor: 'bg-green-50' },
                    { value: 5, emoji: '😍', label: 'Muito satisfeita', color: 'from-purple-500 to-purple-400', hoverColor: 'hover:border-purple-400 hover:bg-purple-50', bgColor: 'bg-purple-50' }
                  ].map((rating, index) => (
                    <motion.div
                      key={rating.value}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      className="flex flex-col items-center space-y-2"
                    >
                      <motion.button
                        type="button"
                        onClick={() => handleRatingChange(rating.value)}
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 relative ${
                          formData.rating === rating.value
                            ? `bg-gradient-to-r ${rating.color} text-white shadow-lg transform scale-110 ring-4 ring-white ring-opacity-50`
                            : `bg-white border-2 border-gray-200 ${rating.hoverColor} shadow-sm`
                        }`}
                        title={rating.label}
                        aria-label={rating.label}
                      >
                        <motion.span
                          className="filter drop-shadow-sm"
                          animate={formData.rating === rating.value ? {
                            scale: [1, 1.2, 1],
                            transition: { duration: 0.5, ease: "easeInOut" }
                          } : {}}
                        >
                          {rating.emoji}
                        </motion.span>
                        {formData.rating === rating.value && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          </motion.div>
                        )}
                      </motion.button>

                      <span className="text-xs text-gray-500 text-center max-w-[80px] leading-tight hidden sm:block">
                        {rating.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center">
                  <motion.p
                    key={formData.rating}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-medium text-purple-800"
                  >
                    {formData.rating === 0 && "Selecione como você se sente sobre sua experiência"}
                    {formData.rating === 1 && "😢 Muito insatisfeita"}
                    {formData.rating === 2 && "😞 Insatisfeita"}
                    {formData.rating === 3 && "😐 Neutra"}
                    {formData.rating === 4 && "😊 Satisfeita"}
                    {formData.rating === 5 && "😍 Muito satisfeita"}
                  </motion.p>

                  {formData.rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="text-sm text-gray-500 mt-2"
                    >
                      Obrigada por compartilhar como você se sente!
                    </motion.p>
                  )}
                </div>
              </motion.div>

              {/* Experience Section */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                  <label className="text-xl font-semibold text-purple-800">
                    Conte-nos sobre sua experiência
                  </label>
                </div>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  rows={4}
                  placeholder="O que você achou da plataforma? O que funcionou bem? O que poderia melhorar?"
                  required
                />
              </motion.div>

              {/* Suggestions Section */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                  <label className="text-xl font-semibold text-purple-800">
                    Sugestões para melhorias
                  </label>
                </div>
                <textarea
                  value={formData.suggestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
                  className="w-full p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  rows={4}
                  placeholder="Tem alguma sugestão para melhorarmos a plataforma?"
                />
              </motion.div>

              {/* Contact Section */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-purple-600" />
                  <label className="text-xl font-semibold text-purple-800">
                    Email para contato (opcional)
                  </label>
                </div>
                <input
                  type="email"
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Seu email para contato"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={!formData.rating || !formData.experience || isSubmitting}
                  size="lg"
                  className={`w-full py-6 text-lg font-medium transition-all duration-300 ${
                    !formData.rating || !formData.experience || isSubmitting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Feedback
                    </div>
                  )}
                </Button>
              </motion.div>
            </motion.form>
    </PageLayout>
  );
}