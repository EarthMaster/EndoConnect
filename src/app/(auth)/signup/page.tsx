'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordStrength } from "@/components/ui/password-strength";
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, Mail, User, ArrowRight, Heart, Shield, Sparkles } from 'lucide-react';

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  
  // Add refs to track component state
  const isMountedRef = useRef(true)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({
      ...prev,
      password
    }))
  }

  const validatePassword = (password: string): boolean => {
    const requirements = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ]
    return requirements.every(req => req)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isMountedRef.current) return
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (!validatePassword(formData.password)) {
      setError('A senha não atende aos requisitos de segurança')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      console.log(formData);
      await authService.signUp(formData)
      if (isMountedRef.current) {
        setEmail(formData.email)
        setShowConfirmation(true)
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || 'Falha ao criar conta')
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  const handleResendEmail = async () => {
    if (!isMountedRef.current) return
    
    setIsLoading(true)
    setError('')

    try {
      await authService.resendConfirmationEmail(email)
      if (isMountedRef.current) {
        setError('Email de confirmação reenviado! Verifique sua caixa de entrada.')
        // Clear the success message after 5 seconds
        errorTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setError('')
          }
        }, 5000)
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || 'Falha ao reenviar email de confirmação')
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isMountedRef.current) return
    
    try {
      setIsLoading(true);
      setError("");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err.message || 'Falha ao entrar com Google');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  if (showConfirmation) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto"
                >
                  <Mail className="w-8 h-8 text-purple-600" />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-700 bg-clip-text text-transparent"
                >
                  Verifique seu email
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 leading-relaxed"
                >
                  Enviamos um link de confirmação para <span className="font-semibold text-purple-700">{email}</span>
                </motion.p>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error-confirmation"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start space-x-3 bg-red-50 text-red-600 p-4 rounded-lg text-sm overflow-hidden"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <p className="text-gray-600 text-sm">
                    Não recebeu o email? Verifique sua pasta de spam ou
                  </p>
                  <Button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-purple-200 hover:bg-purple-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Reenviar email de confirmação'
                    )}
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          key="signup-form"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0">
            <div className="space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-4"
              >
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-pink-700 bg-clip-text text-transparent">
                  Criar Conta
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  Comece sua jornada de autocuidado e conhecimento
                </p>
              </motion.div>

              {/* Error Display */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error-signup"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start space-x-3 bg-red-50 text-red-600 p-4 rounded-lg text-sm overflow-hidden border border-red-200"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSignUp}
                className="space-y-6"
              >
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Seu nome"
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                    className="space-y-2"
                  >
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Sobrenome
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Seu sobrenome"
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                    />
                  </div>
                </motion.div>

                {/* Password with Strength Indicator */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <PasswordStrength
                    password={formData.password}
                    onPasswordChange={handlePasswordChange}
                    placeholder="Crie uma senha forte"
                    className="border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  />
                </motion.div>

                {/* Confirm Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme sua senha"
                      required
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`border-gray-200 focus:border-purple-300 focus:ring-purple-200 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                          : ''
                      }`}
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-600 text-xs mt-1"
                      >
                        As senhas não coincidem
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Terms Checkbox */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start space-x-3"
                >
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                    required
                  />
                  <label htmlFor="terms" className="block text-sm text-gray-700 leading-relaxed">
                    Eu concordo com os{' '}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline font-medium">
                      Termos de Uso
                    </Link>{' '}
                    e{' '}
                    <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline font-medium">
                      Política de Privacidade
                    </Link>
                  </label>
                </motion.div>

                {/* Submit Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-4"
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !validatePassword(formData.password) || formData.password !== formData.confirmPassword}
                    className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        Criar conta
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Ou continue com
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full py-6 border-gray-200 hover:bg-gray-50 transition-all duration-300"
                    size="lg"
                  >
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Entrar com Google
                  </Button>
                </motion.div>
              </motion.form>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-sm text-gray-600"
              >
                Já tem uma conta?{' '}
                <Link
                  href="/signin"
                  className="font-medium text-purple-600 hover:text-purple-700 hover:underline"
                >
                  Entre aqui
                </Link>
              </motion.p>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
