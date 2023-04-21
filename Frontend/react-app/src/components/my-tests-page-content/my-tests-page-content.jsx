import { AppRoute } from '../../const';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { FilterForm } from './filter-form/filter-form';
import { Link } from 'react-router-dom';
import styles from './my-tests-page-content.module.scss';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../store';

export const MyTestsPageContent = () => {
  const [testList, setTestList] = useState([]);
  const [nextPage, setNextPage] = useState('api/tests/');

  // Без этого стейт не обновляется
  const stateRef = useRef();
  stateRef.nextPage = nextPage;
  stateRef.testList = testList;

  const fetchTestListData = async () => {
    // Избегаю лишних запросов к серверу
    if (stateRef.nextPage === null) return;

    const {data} = await api.get(stateRef.nextPage);
    // Избегаю дублирования
    if ((stateRef.testList.length === 0) || (stateRef.testList.at(-1).id !== data.results.at(-1).id)) {
      setTestList(stateRef.testList.concat(data.results));
      // Убираю начало адреса запроса
      setNextPage(data.next ? data.next.slice(22) : null);
    }
  }

  useEffect(() => {
    fetchTestListData();

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight

    if (bottom) {
      fetchTestListData();
    }
  }

  return (
    <main className={styles.pageMain}>
      <ProfileNavigation />
      <section className={styles.sectionMain}>
        <h1>Мои тесты</h1>
        <div className={styles.listControls}>
          <FilterForm />
          <Link to={AppRoute.CreateTest} className={styles.createTestLink}>Создать тест</Link>
        </div>
        <TestListProfile testList={testList}/>
      </section>
    </main>
  );
}
