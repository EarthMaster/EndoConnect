import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Eye, EyeOff } from 'lucide-react'
import { Input } from './input'

interface PasswordStrengthProps {
  password: string
  onPasswordChange: (password: string) => void
  placeholder?: string
  className?: string
  showStrengthMeter?: boolean
  showRequirements?: boolean
}

interface PasswordRequirement {
  id: string
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'Pelo menos 8 caracteres',
    test: (password) => password.length >= 8
  },
  {
    id: 'uppercase',
    label: 'Uma letra maiúscula',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    label: 'Uma letra minúscula',
    test: (password) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    label: 'Um número',
    test: (password) => /\d/.test(password)
  },
  {
    id: 'special',
    label: 'Um caractere especial (!@#$%^&*)',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
]

export function PasswordStrength({
  password,
  onPasswordChange,
  placeholder = "••••••••",
  className = "",
  showStrengthMeter = true,
  showRequirements = true
}: PasswordStrengthProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const getPasswordStrength = (password: string): number => {
    if (!password) return 0
    const passedRequirements = passwordRequirements.filter(req => req.test(password))
    return (passedRequirements.length / passwordRequirements.length) * 100
  }

  const getStrengthColor = (strength: number): string => {
    if (strength < 40) return 'bg-red-500'
    if (strength < 70) return 'bg-yellow-500'
    if (strength < 90) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthLabel = (strength: number): string => {
    if (strength < 40) return 'Fraca'
    if (strength < 70) return 'Média'
    if (strength < 90) return 'Forte'
    return 'Muito Forte'
  }

  const strength = getPasswordStrength(password)

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pr-10 ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {password && showStrengthMeter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Força da senha:</span>
              <span className={`font-medium ${
                strength < 40 ? 'text-red-600' :
                strength < 70 ? 'text-yellow-600' :
                strength < 90 ? 'text-blue-600' :
                'text-green-600'
              }`}>
                {getStrengthLabel(strength)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {password && showRequirements && (isFocused || strength < 100) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 rounded-lg p-3 space-y-2"
          >
            <p className="text-sm font-medium text-gray-700 mb-2">
              Requisitos da senha:
            </p>
            {passwordRequirements.map((requirement, index) => {
              const isValid = requirement.test(password)
              return (
                <motion.div
                  key={requirement.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-2 text-sm transition-colors ${
                    isValid ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isValid ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {isValid ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <X className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                  <span className={isValid ? 'line-through' : ''}>
                    {requirement.label}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 