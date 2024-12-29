import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import learningPackageRoutes from './routes/learningPackage.routes';
import authRoutes from './routes/auth.routes';
import { sequelize } from './config/database.config';
import cors from 'cors';
import { LearningPackage } from './models/learningPackage.model';
import { User } from './models/user.model';
import bcrypt from 'bcrypt';
import { setupWebSocketHandlers } from './websocket/websocket.handlers';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/package', learningPackageRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/liveness', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Function to preload data into the database
async function preloadData() {
  // Create demo user if it doesn't exist
  const demoUser = await User.findOne({ where: { username: 'demo' } });
  if (!demoUser) {
    const hashedPassword = await bcrypt.hash('demo123', 10);
    await User.create({
      username: 'demo',
      password: hashedPassword
    });
    console.log('Demo user created');
  }

  // Create demo packages if none exist
  const count = await LearningPackage.count();
  if (count === 0) {
    const user = await User.findOne({ where: { username: 'demo' } });
    await LearningPackage.bulkCreate([
      {
        title: 'Learn TypeScript',
        description: 'Basics of TypeScript',
        category: 'Programming',
        targetAudience: 'Developers',
        difficultyLevel: 5,
        userId: user!.id,
      },
      {
        title: 'Learn NodeJs',
        description: 'Backend Development',
        category: 'Programming',
        targetAudience: 'Developers',
        difficultyLevel: 6,
        userId: user!.id,
      },
      {
        title: 'Learn Html',
        description: 'Basics of Web',
        category: 'Web Development',
        targetAudience: 'Beginners',
        difficultyLevel: 2,
        userId: user!.id,
      },
      {
        title: 'Learn Angular',
        description: 'Frontend Framework',
        category: 'Programming',
        targetAudience: 'Frontend Developers',
        difficultyLevel: 8,
        userId: user!.id,
      },
    ]);
    console.log('Preloaded LearningPackages into the database.');
  }
}

// Setup WebSocket handlers
setupWebSocketHandlers(io);

// Add this log
io.on('connection', (socket) => {
  console.log('Client connected to WebSocket');
});

// Start server and connect to database
const port = 3000;
httpServer.listen(port, async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Drop and recreate tables
    await sequelize.sync({ force: true });
    console.log('Database tables dropped and recreated.');

    // Preload initial data
    await preloadData();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server is running at http://localhost:${port}`);
});
