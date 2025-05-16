'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import Image from 'next/image'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log(formData);
      await authService.signUp(formData)
      setEmail(formData.email)
      setShowConfirmation(true)
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    setError('')

    try {
      await authService.resendConfirmationEmail(email)
      setError('Confirmation email resent! Please check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/screening`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google')
    } finally {
      setIsLoading(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-black">Check your email</h1>
            <p className="text-gray-600 text-sm mt-2">
              We've sent a confirmation link to {email}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-600 text-sm text-center">
              Didn't receive the email? Check your spam folder or
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isLoading}
              className="w-full text-[#1E5542] py-2 rounded-md hover:underline transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Resend confirmation email'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-purple-900">Criar Conta</h1>
          <p className="text-gray-600">
            Comece sua jornada de autocuidado e conhecimento
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              required
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirmar Senha
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Eu concordo com os{" "}
              <Link
                href="/terms"
                className="text-purple-600 hover:text-purple-500"
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                href="/privacy"
                className="text-purple-600 hover:text-purple-500"
              >
                Política de Privacidade
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Criar Conta
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              href="/signin"
              className="text-purple-600 hover:text-purple-500 font-medium"
            >
              Entrar
            </Link>
          </p>
        </div>
      </Card>
    </main>
  )
}