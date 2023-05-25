import { AppRoute } from '../../const';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { FilterForm } from './filter-form/filter-form';
import { Link } from 'react-router-dom';
import styles from './my-tests-page-content.module.scss';
import { useState } from 'react';
import { useScroll } from '../../hooks';

export const MyTestsPageContent = () => {
  const [testList, setTestList] = useState([]);
  const [baseRequest, setBaseRequest] = useState('tests/');

  useScroll(baseRequest, setTestList);

  // Список ссылок в подвале плашке
  const linkList = (id) => ([
    {key: 1, link: `${AppRoute.EditTestDescription}/${id}`, label: 'Описание'},
    {key: 2, link: `${AppRoute.EditTest}/${id}`, label: 'Редактировать'},
    {key: 3, link: '#', label: 'Статистика'},
  ]);

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <section className={styles.sectionMain}>
        <h1>Мои тесты</h1>
        <div className={styles.listControls}>
          <FilterForm
            setBaseRequest={setBaseRequest}
          />
          <Link to={AppRoute.CreateTest} className={styles.createTestLink}>Создать тест</Link>
        </div>
        <TestListProfile testList={testList} linkList={linkList}/>
      </section>
    </main>
  );
}
