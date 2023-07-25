import styles from './profile-tests.module.scss';
import { AppRoute } from '../../reusable/const';
import { ProfileNavigation } from '../profile-navigation/profile-navigation';
import { TestListProfile } from '../test-list-profile/test-list-profile';
import { useState } from 'react';
import { useScroll } from '../../reusable/hooks';
import { useParams } from 'react-router';
import { FilterForm } from '../filter-form/filter-form';
import React from 'react';
import { Test, TestWithAvatar } from '../../types/Test';
import { FilterValue } from '../../types/Filter';
import { LinkItem } from '../../types/LinkList';

export const ProfileTestsComponent = () => {
  const {userID} = useParams();
  const defaultRequest = `tests/user/${(userID || 'me')}/`;

  const [testList, setTestList] = useState<Test[]>([]);
  const [baseRequest, setBaseRequest] = useState(defaultRequest);

  useScroll(baseRequest, setTestList);
  
  // Список ссылок в подвале плашки
  const linkList = (testID: Test['testID']): LinkItem[] => ([
    { key: 1, link: `${AppRoute.TestDescription}/${testID}`, label: 'Описание' },
  ]);

  const filterValues: FilterValue[] = [
    { value: 'all', label: 'Все', appendValue: ''},
    { value: 'finished', label: 'Завершенные', appendValue: 'is_finished=True'},
    { value: 'unfinished', label: 'Незавершенные', appendValue: 'is_finished=False'},
  ];

  const ConvertDataStC = (data: any) => {
    const modifiedData: TestWithAvatar[] = data.map((t: any) => {
      const testData: Test = {
        testTitle: t.title,
        testAvatar: t.avatar,
        testID: t.id ?? t.test,
        isPublished: t.is_published,
      }
      return testData;
    })
    return modifiedData;
  }

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
          <TestListProfile testList={ConvertDataStC(testList)} linkList={linkList} isAttemptsAvailiable isEditable={false} />
        </section>
      </main>
    </>
  );
}
