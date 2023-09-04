import { TestWithSummary } from './Test'

export interface UserInfo {
  userID: string
  userName: string
  userAvatar: string
}

export interface SelfInfo extends UserInfo {
  email: string
}

export interface UserInfoExtended extends UserInfo {
  userBio: string
  finishedTestList: TestWithSummary[]
  unfinishedTestList: TestWithSummary[]
  createdTestList: TestWithSummary[]
}
