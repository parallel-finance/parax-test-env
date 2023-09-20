export enum ApprovingStatus {
  IDLE = 'IDLE', // initial status
  CHECKING = 'CHECKING', // checking approval
  ERROR_CHECKING = 'ERROR_CHECKING', // fail at checking
  APPROVED = 'APPROVED',
  NOT_APPROVED = 'NOT_APPROVED',
  SIGNING = 'SIGNING',
  APPROVING = 'APPROVING',
  ERROR_APPROVING = 'ERROR_APPROVING' // fail at approving
}
