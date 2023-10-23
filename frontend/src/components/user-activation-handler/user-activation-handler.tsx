'use client'

import { FC, useEffect } from 'react'
import { AppRoute } from '../../reusable/const'
import { useParams, useRouter } from 'next/navigation'
import { useActivateUserMutation } from '@/services/authApi'
import { Spinner } from '../Spinner/Spinner'

export const UserActivationHandler: FC = () => {
  const params = useParams()
  const { uid, token } = params
  const router = useRouter()
  const [activateUser] = useActivateUserMutation()

  useEffect(() => {
    activateUser({ uid, token })
    router.replace(AppRoute.Root)
  }, [])

  return null
}
