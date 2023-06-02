import { TestTileProfile } from './test-tile-profile/test-tile-profile';

export const TestListProfile = ({testList, linkList, isEditable}) => {
  return (
    <ul>
      {testList.map((testItem) => {
        const {title, avatar} = testItem;
        const testID = testItem.id ?? testItem.test;
        const isPublished = testItem.is_published;
        return <TestTileProfile key={testID} testID={testID} title={title} avatar={avatar} isPublished={isPublished} linkList={linkList} isEditable={isEditable}/>
      })}
    </ul>
  );
}
