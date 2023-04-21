import { TestTileProfile } from './test-tile-profile/test-tile-profile';

export const TestListProfile = ({testList}) => {
  return (
    <ul>
      {testList.map((testItem) => {
        const {id, title, avatar, isPublished} = testItem;
        return <TestTileProfile key={id} id={id} title={title} avatar={avatar} isPublished={isPublished}/>
      })}
    </ul>
  );
}
