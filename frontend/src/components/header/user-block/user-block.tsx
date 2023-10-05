'use client'

import { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuthorizationStatus, selectUserInfo } from '../../../store/selectors'
import styles from './user-block.module.scss'
import { LoginWindow } from '../../login-window/login-window'
import { DropdownMenu } from '../../dropdown-menu/dropdown-menu'
import { PaleButton } from '../../pale-button/pale-button'
import { AvatarBlock } from '../../avatar-block/avatar-block'
import { useGetCurrentUserDataQuery } from '@/services/usersApi'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { userLoggedOut } from '@/store/authSlice'
import { dropToken } from '@/services/token'

export const UserBlock: FC = () => {
  const { data: userInfo, isSuccess: isAuthorized, isError, error } = useGetCurrentUserDataQuery()
  const userAvatar = userInfo?.userAvatar || ''
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleMenuClick = () => {
    setIsMenuOpen(true)
  }

  const actionCloseMenu = () => {
    setIsMenuOpen(false)
  }

  if (isError) {
    const err = error as FetchBaseQueryError
    if (err.status === 401) {
      dispatch(userLoggedOut)
      dropToken()
    }
  }

  if (!isAuthorized) {
    return (
      <>
        <PaleButton label={'Войти'} action={handleOpenModal} />
        <LoginWindow isOpen={isModalOpen} handleCloseModal={handleCloseModal} />
      </>
    )
  }

  return (
    <div className={styles.userBlock}>
      <button onClick={handleMenuClick}>
        <AvatarBlock src={userAvatar} size={41} additionalStyle={styles.userAvatar} />
      </button>
      {isMenuOpen && <DropdownMenu actionCloseMenu={actionCloseMenu} />}
    </div>
  )
}
