import { AppRoute } from '../../reusable/const';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { FilterForm } from './filter-form/filter-form';
import { Link } from 'react-router-dom';
import styles from './my-tests-page-content.module.scss';
import { useState } from 'react';
import { useScroll } from '../../reusable/hooks';

export const MyTestsPageContent = () => {
  const defaultRequest = 'tests/created/';
  const [testList, setTestList] = useState([]);
  const [baseRequest, setBaseRequest] = useState(defaultRequest);

  useScroll(baseRequest, setTestList);

  // Список ссылок в подвале плашке
  const linkList = (testID) => ([
    {key: 1, link: `${AppRoute.EditTestDescription}/${testID}`, label: 'Описание'},
    {key: 2, link: `${AppRoute.EditTest}/${testID}`, label: 'Редактировать'},
  ]);

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <section className={styles.sectionMain}>
        <h1>Мои тесты</h1>
        <div className={styles.listControls}>
          <FilterForm
            defaultRequest={defaultRequest}
            setBaseRequest={setBaseRequest}
          />
          <Link to={AppRoute.CreateTest} className={styles.createTestLink}>Создать тест</Link>
        </div>
        <TestListProfile testList={testList} linkList={linkList} isEditable/>
      </section>
    </main>
  );
}
