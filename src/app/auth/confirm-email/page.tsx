"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ConfirmEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Clear any existing errors
        setError("");
        
        // Check if this is a confirmation from email link
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (token_hash && type === 'signup') {
          // This is a confirmation from email link
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'signup'
          });
          
          if (verifyError) {
            console.error("Email verification error:", verifyError);
            setError(verifyError.message);
          } else {
            setConfirmed(true);
            // Redirect to signin after 3 seconds so user can sign in
            setTimeout(() => {
              router.push('/auth/signin?message=Email confirmed! Please sign in to continue.');
            }, 3000);
          }
          setLoading(false);
        } else {
          // User navigated here directly or came from signup, show waiting state
          setLoading(false);
        }
      } catch (error) {
        console.error("Unexpected error in email confirmation:", error);
        setError("An unexpected error occurred during email confirmation");
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError("Please enter your email address to resend confirmation");
      setResendMessage("");
      return;
    }

    setResendLoading(true);
    setError("");
    setResendMessage("");

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm-email`
      }
    });

    setResendLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setResendMessage("Confirmation email sent! Please check your inbox.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Confirming your email...</p>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email Confirmed!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your email has been successfully verified. Please sign in to continue to your account.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/auth/signin?message=Email confirmed! Please sign in to continue.')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continue to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a confirmation link to your email address. Please click the link to verify your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error.includes("Please enter your email") ? "Email Required" : "Confirmation Failed"}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {resendMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {resendMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  What to do next:
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your email inbox (including spam/junk folder)</li>
                    <li>Click the confirmation link in the email</li>
                    <li>You'll see a success message and be redirected to sign in</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Resend confirmation section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Didn't receive the email?
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="resend-email" className="block text-sm font-medium text-gray-700">
                  Enter your email to resend confirmation
                </label>
                <input
                  id="resend-email"
                  name="resend-email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <button
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? "Sending..." : "Resend Confirmation Email"}
              </button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/auth/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to Sign In
            </Link>
            <br />
            <Link
              href="/auth/signup"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              Try signing up again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 