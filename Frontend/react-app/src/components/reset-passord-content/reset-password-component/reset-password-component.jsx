import { useNavigate, useParams } from "react-router";
import { AppRoute } from "../../../const";
import { api } from "../../../store";
import styles from './reset-password-component.module.scss';
import { useState } from "react";

export const ResetPasswordComponent = () => {
    const [formState, setFormState] = useState({
        password: '',
        passwordRepeat: '',
    });

    const { uid, token } = useParams();
    const navigate = useNavigate();

    const resetPassword = async (uid, token, password) => {
        await api.post('api/auth/users/reset_password_confirm/', { token, uid, new_password: password });
    }

    const handleFormSubmit = async (evt) => {
        evt.preventDefault();
        try {
            await resetPassword(uid, token, formState.password);
            navigate(AppRoute.Root);
        }
        catch {
            return;
        }
    }

    const handleFieldChange = (evt) => {
        const { name, value } = evt.target;
        setFormState({ ...formState, [name]: value });
    }

    return (
        <div className={styles.container}>
            <h1>Изменение пароля</h1>
            <form>
                <input type='password' name='password' id='password' placeholder='Новый пароль' value={formState.password} onChange={handleFieldChange} />
                <input type='password' name='passwordRepeat' id='passwordRepeat' placeholder='Подтвердите новый пароль' value={formState.passwordRepeat} onChange={handleFieldChange} />
                <button onClick={handleFormSubmit}>Изменить пароль</button>
            </form>
        </div>
    );
}
