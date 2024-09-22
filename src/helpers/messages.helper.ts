import { Languages } from 'src/utils/language-preference';

/**
 * @description
 * This helper file contains all the messages used in the application.
 *
 * It is used to centralize the messages and make it easier to change them.
 */
export const MessagesHelper = {
  PASSWORD_OR_EMAIL_INVALID: {
    'en-US':
      'Invalid email and/or password or the user does not have system access.',
    'pt-BR':
      'E-mail e/ou senha inválidos ou o usuário se encontra sem acesso ao sistema.',
  },
  USER_LOGGED: {
    'en-US': 'User successfully logged in!',
    'pt-BR': 'Usuário logado com sucesso!',
  },
  NEW_TOKEN_GENERATED: {
    'en-US': 'New refresh token successfully generated!',
    'pt-BR': 'Novo refresh token gerado com sucesso!',
  },
  MULTIPLE_LOGIN_ERROR: {
    'en-US':
      'User X was logged out from the previous session because another user logged in with their credentials!',
    'pt-BR':
      'Usuário X foi deslogado da sessão anterior porque outro usuário logou com suas credenciais!',
  },
  MULTIPLE_LOGIN_MESSAGE: {
    'en-US':
      'Active session on another device or the user was logged out by another session!',
    'pt-BR':
      'Sessão ativa em outro dispositivo ou o usuário foi deslogado por outra sessão!',
  },
  IP_REQUESTER_NOT_FOUND: {
    'en-US': 'Requester IP missing in request header',
    'pt-BR': 'Ip do requisitante faltando no header da requisição',
  },
  PASSWORD_CHANGED: {
    'en-US': 'User X password successfully changed!',
    'pt-BR': 'Senha do usuário X alterada com successo!',
  },
  PASSWORD_CHANGED_ERROR: {
    'en-US': 'User X password was not changed!',
    'pt-BR': 'Senha do usuário X não foi alterada!',
  },
  CREATE_USER_SUCCESS: {
    'en-US': 'User X successfully created!',
    'pt-BR': 'Usuário X criado com sucesso!',
  },
  CREATE_USER_ERROR: {
    'en-US': 'User X could not be created!',
    'pt-BR': 'Usuário X não conseguiu ser criado!',
  },
  INACTIVE_ERROR: {
    'en-US': 'User X could not be deactivated!',
    'pt-BR': 'Usuário X não conseguiu ser inativado!',
  },
  INACTIVE_SUCCESS: {
    'en-US': 'User X successfully deactivated!',
    'pt-BR': 'Usuário X inativado com sucesso!',
  },
  USER_UPDATED_SUCCESS: {
    'en-US': 'User X successfully updated!',
    'pt-BR': 'Usuário X atualizado com sucesso!',
  },
  USER_UPDATED_ERROR: {
    'en-US': 'Error updating User X!',
    'pt-BR': 'Erro ao atualizar usuário X!',
  },
  USER_UPDATE_YOURSELF: {
    'en-US': 'You are not allowed to update your own user!',
    'pt-BR': 'Não é permitido atualizar seu próprio usuário!',
  },
  USER_DELETED_SUCCESS: {
    'en-US': 'User X successfully deleted!',
    'pt-BR': 'Usuário X deletado com sucesso!',
  },
  USER_DELETED_ERROR: {
    'en-US': 'Error deleting User X!',
    'pt-BR': 'Erro ao deletar usuário X!',
  },
  USER_BLOCKED: {
    'en-US':
      'User X blocked due to excessive attempts, please contact an administrator!',
    'pt-BR':
      'Usuário X bloqueado por excesso de tentativas, procure um administrador!',
  },
  USER_BLOCKED_MESSAGE: {
    'en-US':
      'User blocked due to excessive attempts, please contact an administrator!',
    'pt-BR':
      'Usuário bloqueado por excesso de tentativas, procure um administrador!',
  },
  USER_BLOCKED_BY_ADMIN: {
    'en-US': 'User(s) X blocked by a system administrator!',
    'pt-BR': 'Usuário(s) X bloqueado por um administrador do sistema!',
  },
  USER_BLOCKED_BY_ADMIN_MESSAGE: {
    'en-US': 'User blocked by an administrator!',
    'pt-BR': 'Usuário bloqueado por um administrador!',
  },
  USER_NOT_AUTHORIZED: {
    'en-US': 'User X does not have permission to take this action!',
    'pt-BR': 'Usuário X não tem permissões para tomar a ação!',
  },
  NOT_AUTHORIZED_RESOURCE: {
    'en-US': 'User not authorized to use this resource!',
    'pt-BR': 'Usuário não autorizado a utilizar esse recurso!',
  },
  USER_BLOCKED_TRYING_ACCESS: {
    'en-US': 'User X blocked trying to access the system!',
    'pt-BR': 'Usuário X bloqueado tentando acessar o sistema!',
  },
  USER_INACTIVE_TRYING_ACCESS: {
    'en-US': 'Inactive User X trying to access the system!',
    'pt-BR': 'Usuário X inativo tentando acessar o sistema!',
  },
  USER_UNBLOCKED_SUCCESS: {
    'en-US': 'User X successfully unblocked!',
    'pt-BR': 'Usuários X desbloqueado com sucesso!',
  },
  USER_UNBLOCKED_ERROR: {
    'en-US': 'User(s) X could not be unblocked!',
    'pt-BR': 'Usuário(s) X não conseguiu ser desbloqueado!',
  },
  USER_NOT_FOUND: {
    'en-US': 'User X not found!',
    'pt-BR': 'Usuário X não encontrado!',
  },
  USERS_NOT_FOUND: {
    'en-US': 'Users not found!',
    'pt-BR': 'Usuários não encontrados!',
  },
  LOGIN_SUCCESS: {
    'en-US': 'User X successfully logged in!',
    'pt-BR': 'Login do usuário X efetuado com sucesso!',
  },
  LOGIN_ERROR: {
    'en-US': 'Error logging in User X, invalid user and/or password!',
    'pt-BR':
      'Erro ao efetuar login do usuário X, usuário e/ou senha inválidos!',
  },
  USER_LOGGED_OUT: {
    'en-US': 'User X successfully logged out!',
    'pt-BR': 'Usuário X deslogado com sucesso!',
  },
  REFRESH_TOKEN: {
    'en-US': 'Refresh token for User X successfully generated!',
    'pt-BR': 'Refresh token do usuário X gerado com sucesso!',
  },
  REFRESH_TOKEN_ERROR: {
    'en-US': 'Failed to generate refresh token for User X!',
    'pt-BR': 'Refresh token do usuário X não conseguiu ser gerado com sucesso!',
  },
  RESET_PASSWORD_SUCCESS: {
    'en-US': 'User X password reset successfully!',
    'pt-BR': 'Senha do usuário X resetada com sucesso!',
  },
  RESET_PASSWORD_ERROR: {
    'en-US': 'Error resetting User X password!',
    'pt-BR': 'Erro ao resetar senha do usuário X!',
  },
  REACTIVE_USER_SUCCESS: {
    'en-US': 'User X reactivated successfully!',
    'pt-BR': 'Usuário X reativado com sucesso!',
  },
  REACTIVE_USER_ERROR: {
    'en-US': 'Failed to reactivate User X!',
    'pt-BR': 'Usuário X não conseguiu ser reativado com sucesso!',
  },
  REFRESH_TOKEN_NOT_PRESENT: {
    'en-US': 'Refresh token not present in the request',
    'pt-BR': 'Refresh token não presente na requisição',
  },
  USER_ALREADY_REGISTERED: {
    'en-US': 'User already exists in the system',
    'pt-BR': 'Usuário já existe no sistema',
  },
  SUCCESS_SENDING_EMAIL: {
    'en-US': 'Email sent successfully',
    'pt-BR': 'Email enviado com sucesso',
  },
  FAIL_SENDING_EMAIL: {
    'en-US': 'Unable to send the email',
    'pt-BR': 'Não foi possível enviar o email',
  },
  ACCOUNT_DISABLED: {
    'en-US': 'This account is disabled',
    'pt-BR': 'Esta conta está desativada',
  },
  USER_INACTIVE: {
    'en-US': 'User X is inactive',
    'pt-BR': 'Usuário X está inativo',
  },
  EMAIL_ALREADY_IN_USE: {
    'en-US': 'Email is already in use',
    'pt-BR': 'Email já está em uso',
  },
  SESSION_EXPIRED: {
    'en-US': 'Session expired',
    'pt-BR': 'Sessão expirada',
  },
  PERSONAL_INFORMATION_UPDATED: {
    'en-US': 'User X personal information updated',
    'pt-BR': 'Informações pessoais do usuário X atualizadas',
  },
  PERSONAL_INFORMATION_UPDATED_ERROR: {
    'en-US': 'Error updating User X personal information',
    'pt-BR': 'Erro ao atualizar informações pessoais do usuário X',
  },
  TOKEN_INVALID: {
    'en-US': 'Invalid token',
    'pt-BR': 'Token inválido',
  },
  RECOVERY_PASSWORD_TOKEN_USED: {
    'en-US': 'Recovery password token already used',
    'pt-BR': 'Token de recuperação de senha já utilizado',
  },
  REFRESH_TOKEN_INVALID: {
    'en-US': 'Invalid refresh token',
    'pt-BR': 'Refresh token inválido',
  },
  EMAIL_NOT_PRESENT: {
    'en-US': 'Email not present in the request',
    'pt-BR': 'Email não presente na requisição',
  },
  INVALID_TOKEN: {
    'en-US': 'Invalid token',
    'pt-BR': 'Token inválido',
  },
  ACCESS_DENIED: {
    'en-US': 'Access denied',
    'pt-BR': 'Acesso negado',
  },
  USER_ALREADY_ACTIVED: {
    'en-US': 'User already active',
    'pt-BR': 'Usuário já está ativo',
  },
  BLOCK_ERROR: {
    'en-US': 'Error blocking the user',
    'pt-BR': 'Erro ao bloquear o usuário',
  },
  UNBLOCK_ERROR: {
    'en-US': 'Error unblocking the user',
    'pt-BR': 'Erro ao desbloquear o usuário',
  },
  PASSWORD_UNMATCH: {
    'en-US': 'Password does not match',
    'pt-BR': 'Senha não confere',
  },
  PASSWORD_ARE_EQUALS: {
    'en-US': 'New password must be different from the current one',
    'pt-BR': 'Nova senha deve ser diferente da atual',
  },
  DATA_PAGINATION_ERROR: {
    'en-US': 'Error in data pagination',
    'pt-BR': 'Erro ao paginar os dados',
  },
  NOT_FOUND: {
    'en-US': 'Data not found',
    'pt-BR': 'Dado não encontrado',
  },
  ID_REQUIRED: {
    'en-US': 'ID is required',
    'pt-BR': 'Id é obrigatório',
  },
  VERSION_REQUIRED: {
    'en-US': 'Version is required',
    'pt-BR': 'Versão é obrigatória',
  },
  EMAIL_ALREADY_EXISTS: {
    'en-US': 'Email already registered in the system',
    'pt-BR': 'Email já cadastrado no sistema',
  },
  ORGANIZATION_NOT_FOUND: {
    'en-US': 'Organization not found',
    'pt-BR': 'Organização não encontrada',
  },
  CODE_VERIFICATION_INVALID: {
    'en-US': 'Invalid code verification',
    'pt-BR': 'Código de verificação inválido',
  },
};

export enum MessagesHelperKey {
  CODE_VERIFICATION_INVALID = 'CODE_VERIFICATION_INVALID',
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  PASSWORD_OR_EMAIL_INVALID = 'PASSWORD_OR_EMAIL_INVALID',
  USER_LOGGED = 'USER_LOGGED',
  NEW_TOKEN_GENERATED = 'NEW_TOKEN_GENERATED',
  MULTIPLE_LOGIN_ERROR = 'MULTIPLE_LOGIN_ERROR',
  MULTIPLE_LOGIN_MESSAGE = 'MULTIPLE_LOGIN_MESSAGE',
  IP_REQUESTER_NOT_FOUND = 'IP_REQUESTER_NOT_FOUND',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_CHANGED_ERROR = 'PASSWORD_CHANGED_ERROR',
  CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS',
  CREATE_USER_ERROR = 'CREATE_USER_ERROR',
  INACTIVE_ERROR = 'INACTIVE_ERROR',
  INACTIVE_SUCCESS = 'INACTIVE_SUCCESS',
  USER_UPDATED_SUCCESS = 'USER_UPDATED_SUCCESS',
  USER_UPDATED_ERROR = 'USER_UPDATED_ERROR',
  USER_UPDATE_YOURSELF = 'USER_UPDATE_YOURSELF',
  USER_BLOCKED = 'USER_BLOCKED',
  USER_DELETED_SUCCESS = 'USER_DELETED_SUCCESS',
  USER_DELETED_ERROR = 'USER_DELETED_ERROR',
  USER_BLOCKED_MESSAGE = 'USER_BLOCKED_MESSAGE',
  USER_BLOCKED_BY_ADMIN = 'USER_BLOCKED_BY_ADMIN',
  USER_BLOCKED_BY_ADMIN_MESSAGE = 'USER_BLOCKED_BY_ADMIN_MESSAGE',
  USER_NOT_AUTHORIZED = 'USER_NOT_AUTHORIZED',
  NOT_AUTHORIZED_RESOURCE = 'NOT_AUTHORIZED_RESOURCE',
  USER_BLOCKED_TRYING_ACCESS = 'USER_BLOCKED_TRYING_ACCESS',
  USER_INACTIVE_TRYING_ACCESS = 'USER_INACTIVE_TRYING_ACCESS',
  USER_UNBLOCKED_SUCCESS = 'USER_UNBLOCKED_SUCCESS',
  USER_UNBLOCKED_ERROR = 'USER_UNBLOCKED_ERROR',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USERS_NOT_FOUND = 'USERS_NOT_FOUND',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_ERROR = 'LOGIN_ERROR',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR',
  RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR',
  REACTIVE_USER_SUCCESS = 'REACTIVE_USER_SUCCESS',
  REACTIVE_USER_ERROR = 'REACTIVE_USER_ERROR',
  REFRESH_TOKEN_NOT_PRESENT = 'REFRESH_TOKEN_NOT_PRESENT',
  USER_ALREADY_REGISTERED = 'USER_ALREADY_REGISTERED',
  SUCCESS_SENDING_EMAIL = 'SUCCESS_SENDING_EMAIL',
  FAIL_SENDING_EMAIL = 'FAIL_SENDING_EMAIL',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  USER_INACTIVE = 'USER_INACTIVE',
  EMAIL_ALREADY_IN_USE = 'EMAIL_ALREADY_IN_USE',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  PERSONAL_INFORMATION_UPDATED = 'PERSONAL_INFORMATION_UPDATED',
  PERSONAL_INFORMATION_UPDATED_ERROR = 'PERSONAL_INFORMATION_UPDATED_ERROR',
  TOKEN_INVALID = 'TOKEN_INVALID',
  RECOVERY_PASSWORD_TOKEN_USED = 'RECOVERY_PASSWORD_TOKEN_USED',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  EMAIL_NOT_PRESENT = 'EMAIL_NOT_PRESENT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ACCESS_DENIED = 'ACCESS_DENIED',
  USER_ALREADY_ACTIVED = 'USER_ALREADY_ACTIVED',
  BLOCK_ERROR = 'BLOCK_ERROR',
  UNBLOCK_ERROR = 'UNBLOCK_ERROR',
  PASSWORD_UNMATCH = 'PASSWORD_UNMATCH',
  PASSWORD_ARE_EQUALS = 'PASSWORD_ARE_EQUALS',
  DATA_PAGINATION_ERROR = 'DATA_PAGINATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ID_REQUIRED = 'ID_REQUIRED',
  VERSION_REQUIRED = 'VERSION_REQUIRED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
}

/**
 * Retrieves a localized message based on the given key and language. If the specified language
 * is not available, it defaults to Portuguese ('pt-BR').
 *
 * @param {string} key - The key corresponding to the message in the MessagesHelper object.
 * @param {string} [language='pt-BR'] - The language code for the message. Defaults to 'pt-BR' if not specified.
 * @returns {string} The localized message corresponding to the given key and language.
 * @throws {Error} Throws an error if the message key is not found in the MessagesHelper object.
 *
 * @example
 * // Example usage
 * const message = getMessage(MessagesHelperKey.PASSWORD_OR_EMAIL_INVALID, 'en-US');
 */
export const getMessage = (key: string, language: Languages): string => {
  const message = MessagesHelper[key];
  if (!message) {
    return `Message key '${key}' not found in MessagesHelper`;
  }

  return message[language.toLowerCase()] || message['pt-BR'];
};

/**
 * Formats a message string by replacing a placeholder with a specified value and optionally appending a reason.
 *
 * @param {string} message - The message template containing a placeholder 'X' to be replaced.
 * @param {string} replace - The string to replace the 'X' placeholder in the message.
 * @param {string} [reason] - Optional additional reason to be appended to the message.
 * @returns {string} The formatted message string.
 *
 * @description
 * This function takes a message string with a 'X' placeholder and replaces it with the provided 'replace' string.
 * Optionally, if a 'reason' is provided, it appends this reason to the message, enhancing its descriptive nature.
 * This utility is useful for creating dynamic and descriptive messages in logs or user-facing interfaces.
 *
 * @example
 * // Example of using setMessage
 * const formattedMessage = setMessage('User X not found', 'John Doe', 'User record missing');
 * // formattedMessage will be 'User John Doe not found - description: User record missing'
 */
export const setMessage = (
  message: string,
  replace: string,
  reason?: string,
): string => {
  return (
    message.replace('X', replace) + (reason ? ` - description: ${reason}` : '')
  );
};
