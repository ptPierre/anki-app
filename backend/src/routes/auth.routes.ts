import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = 'your-secret-key';

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Create a new user
 *     description: Creates a new user with a hashed password and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Error creating user
 */
// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      password: hashedPassword
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});



/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login an existing user
 *     description: Logs in a user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "demo"
 *               password:
 *                 type: string
 *                 example: "demo123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' });
    }

    // Handle demo user
    if (username === 'demo' && password === 'demo123') {
      const token = jwt.sign(
        { id: 1, username: 'demo' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        token,
        user: {
          id: 1,
          username: 'demo'
        }
      });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token
    res.status(200).json({
      token: token,  // Send raw token
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

export default router;