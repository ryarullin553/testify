import { useNavigate, useParams } from "react-router";
import { AppRoute } from "../../../reusable/const";
import { api } from "../../../store";
import styles from './reset-password-component.module.scss';
import { ChangeEvent, FC, FormEvent, useState } from "react";
import React from "react";

export const ResetPasswordComponent: FC = () => {
  const [formState, setFormState] = useState({
    password: '',
    passwordRepeat: '',
  });

  const { uid, token } = useParams();
  const navigate = useNavigate();

  const resetPassword = async (uid: string, token: string, password: string) => {
    await api.post('auth/users/reset_password_confirm/', { token, uid, new_password: password });
  }

  const handleFormSubmit = async (evt: FormEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!!uid && !!token) {
      try {
        await resetPassword(uid, token, formState.password);
        navigate(AppRoute.Root);
      }
      catch {
        return;
      }
    }
  }

  const handleFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormState({ ...formState, [name]: value });
  }

  return (
    <div className={styles.container}>
      <h1>Изменение пароля</h1>
      <form>
        <input type='password' name='password' id='password' placeholder='Новый пароль' value={formState.password} onChange={handleFieldChange} />
        <input type='password' name='passwordRepeat' id='passwordRepeat' placeholder='Подтвердите новый пароль' value={formState.passwordRepeat} onChange={handleFieldChange} />
        <button onSubmit={handleFormSubmit}>Изменить пароль</button>
      </form>
    </div>
  );
}
