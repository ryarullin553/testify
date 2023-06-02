import styles from './profile-tests.module.scss';
import { AppRoute } from '../../reusable/const';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { useState } from 'react';
import { useScroll } from '../../reusable/hooks';
import { useParams } from 'react-router';
import { FilterForm } from '../filter-form/filter-form';

export const ProfileTestsComponent = () => {
    const {userID} = useParams();
    const defaultRequest = `tests/user/${(userID || 'me')}/`;

    const [testList, setTestList] = useState([]);
    const [baseRequest, setBaseRequest] = useState(defaultRequest);
  
    useScroll(baseRequest, setTestList);
    
    // Список ссылок в подвале плашке
    const linkList = (testID) => ([
        { key: 1, link: `${AppRoute.TestDescription}/${testID}`, label: 'Описание' },
    ]);

    const filterValues = [
      { value: 'all', label: 'Все', appendValue: ''},
      { value: 'finished', label: 'Завершенные', appendValue: 'is_finished=True'},
      { value: 'unfinished', label: 'Незавершенные', appendValue: 'is_finished=False'},
    ];

    return (
        <>
            <main className={styles.pageMain}>
                <ProfileNavigation />
                <section className={styles.sectionMain}>
                    <h1>Пройденные</h1>
                    <div className={styles.listControls}>
                        <FilterForm
                            setBaseRequest={setBaseRequest}
                            defaultRequest={defaultRequest}
                            filterValues={filterValues}
                        />
                    </div>
                    <TestListProfile testList={testList} linkList={linkList} />
                </section>
            </main>
        </>
    );
}
