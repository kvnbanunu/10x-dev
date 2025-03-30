/**
 * @swagger
 * tags:
 *   name: User
 *   description: User operations
 */

/**
 * @swagger
 * /protected/userInfo:
 *   get:
 *     summary: Get current user information
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 request_count:
 *                   type: integer
 *                   description: Number of code generation requests made by the user
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /protected/chat:
 *   post:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: The generated code
 *                 count:
 *                   type: integer
 *                   description: Updated request count
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
