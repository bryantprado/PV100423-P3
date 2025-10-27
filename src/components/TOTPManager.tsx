import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { useAuthStore } from '../store/useAuthStore'
import { Button } from './Button'
import TOTPSetup from './TOTPSetup'
import TOTPVerification from './TOTPVerification'

const TOTPManager: React.FC = () => {
  const { profile, enableTOTP, disableTOTP } = useAuthStore()
  const [showSetup, setShowSetup] = useState(false)
  const [showDisableVerification, setShowDisableVerification] = useState(false)

  const handleEnableTOTP = async (secret: string) => {
    const result = await enableTOTP(secret)
    if (result.success) {
      Alert.alert('Éxito', 'Autenticación TOTP activada correctamente')
      setShowSetup(false)
    } else {
      Alert.alert('Error', result.error || 'No se pudo activar TOTP')
    }
  }

  const handleDisableTOTP = async () => {
    if (!profile?.otp_secret) return

    const result = await disableTOTP()
    if (result.success) {
      Alert.alert('Éxito', 'Autenticación TOTP desactivada correctamente')
      setShowDisableVerification(false)
    } else {
      Alert.alert('Error', result.error || 'No se pudo desactivar TOTP')
    }
  }

  const isTOTPEnabled = profile?.otp_secret !== null && profile?.otp_secret !== ''

  if (showSetup) {
    return (
      <TOTPSetup
        accountName={profile?.nombre || 'Usuario'}
        onComplete={handleEnableTOTP}
        onCancel={() => setShowSetup(false)}
      />
    )
  }

  if (showDisableVerification) {
    return (
      <TOTPVerification
        secret={profile?.otp_secret || ''}
        onSuccess={handleDisableTOTP}
        onCancel={() => setShowDisableVerification(false)}
      />
    )
  }

  return (
    <View className="p-4 bg-gray-800 rounded-2xl mb-4">
      <Text className="text-xl font-semibold text-text mb-4">Autenticación de Dos Factores (TOTP)</Text>

      {isTOTPEnabled ? (
        <>
          <Text className="text-green-400 mb-4">✓ TOTP activado</Text>
          <Button
            title="Desactivar TOTP"
            onPress={() => setShowDisableVerification(true)}
            variant="primary"
          />
        </>
      ) : (
        <>
          <Text className="text-text mb-4">
            Agrega una capa extra de seguridad a tu cuenta activando la autenticación TOTP.
          </Text>
          <Button
            title="Activar TOTP"
            onPress={() => setShowSetup(true)}
          />
        </>
      )}
    </View>
  )
}

export default TOTPManager