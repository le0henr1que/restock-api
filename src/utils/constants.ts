export const MAX_FAILED_LOGIN_ATTEMPTS = 3;
export const BLOCKED_BY_ADMIN = -1;

export interface IAssignmentPermission {
  CREATE: string;
  READ: string;
  UPDATE: string;
  DELETE: string;
}

export const AssignmentPermission: IAssignmentPermission = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

export enum ConfirmType {
  EMAIL = 'EMAIL',
  FIRST_ACCESS = 'FIRST_ACCESS',
  MFA = 'MFA',
  OTHER = 'OTHER',
}
