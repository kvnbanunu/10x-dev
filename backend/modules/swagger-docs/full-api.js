/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication API
 *   - name: User
 *     description: User operations
 *   - name: Admin
 *     description: Admin operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *         email:
 *           type: string
 *           description: User email
 *         username:
 *           type: string
 *           description: Username
 *         is_admin:
 *           type: integer
 *           enum: [0, 1]
 *           description: Admin status (0: regular user, 1: admin)
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *     Request:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Request ID
 *         user_id:
 *           type: integer
 *           description: User ID
 *         prompt:
 *           type: string
 *           description: The prompt used for code generation
 *         response:
 *           type: string
 *           description: The generated code
 *         timestamp:
 *           type: integer
 *           description: Unix timestamp of when the request was made
 */

/**
 * @swagger
 * /register:
 *   post:
 *     operationId: registerUser
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: Username
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 3
 *                 description: User password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     operationId: loginUser
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /resetPasswordRequest:
 *   post:
 *     operationId: resetPasswordRequest
 *     summary: Request a password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *     responses:
 *       200:
 *         description: Reset email sent if email exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /resetPasswordHandle:
 *   post:
 *     operationId: resetPasswordHandle
 *     summary: Handle password reset with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 3
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /protected/userInfo:
 *   get:
 *     operationId: getUserInfo
 *     summary: Get current user information
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /protected/chat:
 *   post:
 *     operationId: generateCode
 *     summary: Generate obfuscated code
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - program
 *               - language
 *             properties:
 *               program:
 *                 type: string
 *                 description: Description of the program to generate
 *               language:
 *                 type: string
 *                 description: Programming language to use
 *     responses:
 *       200:
 *         description: Code generated successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /protected/logout:
 *   post:
 *     operationId: logoutUser
 *     summary: Log out a user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/database:
 *   get:
 *     operationId: getDatabase
 *     summary: Get all users and requests
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Database information retrieved successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/update:
 *   put:
 *     operationId: updateUser
 *     summary: Update a user
 *     description: Update user details including email, username, and admin status. Requires admin privileges.
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - email
 *               - username
 *               - is_admin
 *             properties:
 *               id:
 *                 type: integer
 *                 description: User ID
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: Username
 *               is_admin:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Admin status (0: regular user, 1: admin)
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/delete:
 *   delete:
 *     operationId: deleteUser
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid input or attempting to delete yourself
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       500:
 *         description: Server error
 */
