'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session after email confirmation
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        // If we have a session, the email was confirmed successfully
        if (session) {
          // Sign out the user since we want them to sign in again
          await supabase.auth.signOut()
        }

        // Redirect to sign in page
        router.push('/signin')
      } catch (error) {
        console.error('Error handling auth callback:', error)
        // Still redirect to sign in page even if there's an error
        router.push('/signin')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Verifying your email...</h1>
        <p className="text-gray-600">Please wait while we confirm your email address.</p>
      </div>
    </div>
  )
} 