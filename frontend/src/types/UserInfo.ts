import { TestWithSummary } from './Test'

export interface UserInfo {
  userID: string
  userName: string
  userAvatar: string | null
  userEmail: string
  userInfo: string
  accountDateCreated: Date
}

// export interface SelfInfo extends UserInfo {
//   isLoggedIn: boolean
// }

export interface UserInfoExtended extends UserInfo {
  userBio: string
  finishedTestList: TestWithSummary[]
  unfinishedTestList: TestWithSummary[]
  createdTestList: TestWithSummary[]
}
