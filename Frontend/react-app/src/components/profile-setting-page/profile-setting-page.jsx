import styles from './profile-setting-page.module.scss';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { ResetPasswordComponent } from "../reset-passord-content/reset-password-component/reset-password-component";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../store';
import { AppRoute } from '../../const';

export const ProfileSettingComponent = ({ testID }) => {
    const navigate = useNavigate();
    let [formData, setFormData] = useState({
        title: '',
        shortAbstract: '',
        abstract: '',
    });

    const handleOnFormChange = (evt) => {
        let { name, value } = evt.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleAvatarUpload = (evt) => {
        let { files } = evt.target;
        setFormData({ ...formData, avatar: files[0] });
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let config;
        if (formData.avatar) {
            config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
        }
        if (testID) {
            await api.put(`/api/update_test/${testID}/`, convertTestDataCtS(formData), config);
        } else try {
            const { data } = await api.post('/api/create_test/', convertTestDataCtS(formData), config);
            const id = data.id;
            navigate(`${AppRoute.EditTest}/${id}`);
        } catch (err) {
            return;
        }
    }

    const convertTestDataCtS = (data) => {
        const modifiedData = {
            title: data.title,
            description: data.shortAbstract,
            full_description: data.abstract,
            avatar: data.avatar,
        }
        return modifiedData;
    }

    const convertTestDataStC = (data) => {
        const modifiedData = {
            title: data.title,
            shortAbstract: data.description,
            abstract: data.full_description,
        }
        return modifiedData;
    }

    const fetchTestData = async () => {
        const { data } = await api.get(`/api/test_description/${testID}/`);
        const convertedData = convertTestDataStC(data);
        setFormData(convertedData);
    }

    useEffect(() => {
        if (testID) fetchTestData();
    }, []);



    return (
        <>
            <main className={styles.pageMain}>
                <ProfileNavigation />
                <form className={styles.contentForm} action="#" name="create-test-form">
                    <h1 className={styles.createTest}>Редактирование профиля</h1>
                    <fieldset className={`${styles.contentArea} ${styles.titleForm}`}>
                        <label>Имя и фамилия</label>
                        <textarea
                            id='title'
                            name='title'
                            value={formData.title}
                            onChange={handleOnFormChange}
                        />
                    </fieldset>
                    <fieldset className={`${styles.contentArea} ${styles.shortAbstractForm}`}>
                        <label>О себе</label>
                        <textarea
                            id='shortAbstract'
                            name='shortAbstract'
                            value={formData.shortAbstract}
                            onChange={handleOnFormChange}
                        />
                    </fieldset>
                    <fieldset className={styles.testLogo}>
                        <label>Аватар</label>
                        <div
                            className={styles.dropZone}
                        >
                            <p>png-файл с прозрачностью 230х230px</p>
                            <input
                                type='file'
                                id='avatar'
                                name='avatar'
                                accept="image/png"
                                onChange={handleAvatarUpload}
                            />
                        </div>
                    </fieldset>
                    <div className={styles.controls}>
                        <button className={styles.createButton} onClick={handleSubmit}>Сохранить</button>
                    </div>

                    <hr />

                    <div className={styles.passChange}>
                        <ResetPasswordComponent />
                    </div>
                </form >

            </main>
        </>
    );
}