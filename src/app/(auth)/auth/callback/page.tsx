'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const isMountedRef = useRef(true)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    isMountedRef.current = true
    
    const handleAuthCallback = async () => {
      try {
        // Add a small delay to prevent race conditions
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!isMountedRef.current) return

        // Get the session after email confirmation
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (!isMountedRef.current) return

        // If we have a session, the email was confirmed successfully
        if (session) {
          setStatus('success')
          
          // Wait a bit to show success message
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          if (!isMountedRef.current) return
          
          // Sign out the user since we want them to sign in again
          await supabase.auth.signOut()
        }

        if (!isMountedRef.current) return
        
        // Redirect to sign in page
        router.push('/signin')
      } catch (error) {
        console.error('Error handling auth callback:', error)
        
        if (!isMountedRef.current) return
        
        setStatus('error')
        
        // Wait a bit to show error message
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (!isMountedRef.current) return
        
        // Still redirect to sign in page even if there's an error
        router.push('/signin')
      }
    }

    handleAuthCallback()

    return () => {
      isMountedRef.current = false
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        {status === 'loading' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-semibold text-purple-900 mb-2"
            >
              Verificando seu email...
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600"
            >
              Aguarde enquanto confirmamos seu endereço de email.
            </motion.p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-semibold text-green-900 mb-2"
            >
              Email confirmado!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600"
            >
              Redirecionando para a página de login...
            </motion.p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-red-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-semibold text-red-900 mb-2"
            >
              Erro na confirmação
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600"
            >
              Redirecionando para a página de login...
            </motion.p>
          </>
        )}
      </motion.div>
    </div>
  )
} 