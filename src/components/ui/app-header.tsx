'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from './button';
import { useAuth } from '@/providers/AuthProvider';
import { LogOut, User } from 'lucide-react';

export function AppHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  const isAuthPage = pathname?.includes('/signin') || pathname?.includes('/signup');

  if (isAuthPage) {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/welcome" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="EndoConnect"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EndoConnect
            </span>
          </Link>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Olá, {user.email?.split('@')[0]}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
} 