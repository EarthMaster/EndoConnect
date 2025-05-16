'use client';

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center text-purple-900 font-bold">
              EndoConnect
            </Link>
          </div>
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link href="/screening" className="text-gray-600 hover:text-purple-900">
                Triagem
              </Link>
              <Link href="/education" className="text-gray-600 hover:text-purple-900">
                Educação
              </Link>
              <Link href="/support-group" className="text-gray-600 hover:text-purple-900">
                Grupo de Apoio
              </Link>
              <Link href="/feedback" className="text-gray-600 hover:text-purple-900">
                Feedback
              </Link>
              <button
                onClick={() => logout()}
                className="text-gray-600 hover:text-purple-900"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 