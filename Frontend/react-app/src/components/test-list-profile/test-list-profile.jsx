import { TestTileProfile } from './test-tile-profile/test-tile-profile';

export const TestListProfile = ({testList, linkList}) => {
  return (
    <ul>
      {testList.map((testItem) => {
        const {id, title, avatar} = testItem;
        const isPublished = testItem.is_published;
        return <TestTileProfile key={id} id={id} title={title} avatar={avatar} isPublished={isPublished} linkList={linkList}/>
      })}
    </ul>
  );
}
