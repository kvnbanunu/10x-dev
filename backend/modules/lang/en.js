export const errMsg = {
    authMiss: 'Authentication required',
    authFail: 'Authentication failed',
    invToken: 'Invalid token',
    invSesh: 'Session expired or invalid',
    userExists: 'Email already registered',
    userNotFound: 'User not found',
    notAdmin: 'Admin access required',
    serverFail: 'Something went wrong on the server',
    nonceFail: 'Failed to generate nonce',
    invNonce: 'Invalid nonce',
    expNonce: 'Expired nonce',
    registerFail: 'Registration failed',
    invUserPass: 'Invalid email or password',
    loginFail: 'Login failed',
    logoutFail: 'Logout failed',
    passwordResetFail: 'Reset password failed',
    userInfo: 'Failed to get user info',
    codeFail: 'Failed to generate code',
    adminDB: 'Failed to get database entries',
    adminUpdate: 'Failed to update user',
    adminDeleteSame: 'Cannot delete your own account',
    adminDelete: 'Failed to delete user',
};

export const successMsg = {
    userCreated: 'User registered successfully',
    login: 'Login successful',
    logout: 'Logout succuessful',
    passReset: 'Password reset successful',
    adminUpdate: 'User updated successfully',
    adminDelete: 'User deleted successfully',
};

export const passwordMsg = {
    reqSent: 'If your email is registered, a reset link will be sent.',
    subject: 'Password Reset',
    click: 'Click the following link to reset your password: ',
    invToken: 'Invalid reset token',
    expToken: 'Reset token expired',
};
