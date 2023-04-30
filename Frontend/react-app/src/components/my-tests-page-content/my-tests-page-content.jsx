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
  const [baseRequest, setBaseRequest] = useState('api/user_tests/');
  let nextPage = useRef();
  let isLoading = useRef(false);

  const linkList = (id) => ([
    {key: 1, link: `${AppRoute.EditTestDescription}/${id}`, label: 'Описание'},
    {key: 2, link: `${AppRoute.EditTest}/${id}`, label: 'Редактировать'},
    {key: 3, link: '#', label: 'Статистика'},
  ]);

  const fetchTestListData = async () => {

    if (!nextPage.current) return;

    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const {data} = await api.get(nextPage.current);
      setTestList(prevData => [...prevData, ...data.results]);
      nextPage.current = (data.next ? data.next.slice(22) : null);
    } finally {
      isLoading.current = false;
    }
  }

  useEffect(() => {
    nextPage.current = baseRequest;
    setTestList([]);
    fetchTestListData();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [baseRequest]);

  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

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
