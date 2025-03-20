export const successMsg = {
  handlerRegister: 'User successfully registered',
  handlerLogin: 'User successfully logged in',
  handlerLogout: 'User successfully logged out',
  handlerResetPasswordRequest: 'If your email is registered, a password reset link will be sent',
  handlerResetPasswordHandle: 'Successfully set new password',
  handlerAdminUpdate: 'User info successfully updated',
  handlerAdminDelete: 'User successfully deleted',
};

export const errMsg = {
  handlerNotFound: 'Not Found',
  handlerRegister: 'Failed to register user',
  handlerLogin: 'Failed to login',
  handlerLogout: 'Failed to logout',
  handlerResetPasswordRequest: 'Failed to request password reset',
  handlerResetPasswordHandle: 'Failed to process password reset',
  handlerUserInfo: 'Failed to retreive user info',
  handlerChat: 'Failed to generate code',
  handlerAdminDatabase: 'Failed to access database',
  handlerAdminUpdate: 'Failed to update user info',
  handlerAdminDelete: 'Failed to delete user',
  middlewareAuth: 'Middleware failure',
  server: 'Server failure',
  userExists: 'User already exists',
  userInvalid: 'Invalid email or password',
  userNotFound: 'User not found',
  admin: 'Admin role required',
  adminDeleteSame: 'Cannot remove yourself',
  auth: 'Authorization required',
  token: 'Expired or invalid token',
  session: 'Expired or invalid session',
  resetToken: 'Expired or invalid password reset token',
};

export const passwordMsg = {
  subject: '10x-dev Password Reset Link',
  click: 'Click the following link to reset your password: ',
};
