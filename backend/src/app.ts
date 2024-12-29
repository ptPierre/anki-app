import express, { Request, Response } from 'express';
import learningPackageRoutes from './routes/learningPackage.routes';
import authRoutes from './routes/auth.routes';
import { sequelize } from './config/database.config';
import { LearningPackage } from './models/learningPackage.model';
import cors from 'cors';
import { User } from './models/user.model';
import bcrypt from 'bcrypt'; 


const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use('/api/package', learningPackageRoutes);
app.use('/api/auth', authRoutes);


app.get('/api/liveness', (req: Request, res: Response) => {
    res.status(200).send('OK');
});


// Function to preload data into the database
async function preloadData() {
    let user = await User.findOne();
    if (!user) {
        const hashedPassword = await bcrypt.hash('demo123', 10);  // Hash the password
        user = await User.create({ 
            username: 'demo', 
            password: hashedPassword  // Store hashed password
        });
    }

    const count = await LearningPackage.count();
    if (count === 0) {
        await LearningPackage.bulkCreate([
            {
                title: 'Learn TypeScript',
                description: 'Basics of TypeScript',
                category: 'Programming',
                targetAudience: 'Developers',
                difficultyLevel: 5,
                userId: user.id,
            },
            {
                title: 'Learn NodeJs',
                description: 'Backend Development',
                category: 'Programming',
                targetAudience: 'Developers',
                difficultyLevel: 6,
                userId: user.id,
            },
            {
                title: 'Learn Html',
                description: 'Basics of Web',
                category: 'Web Development',
                targetAudience: 'Beginners',
                difficultyLevel: 2,
                userId: user.id,
            },
            {
                title: 'Learn Angular',
                description: 'Frontend Framework',
                category: 'Programming',
                targetAudience: 'Frontend Developers',
                difficultyLevel: 8,
                userId: user.id,
            },
        ]);
        console.log('Preloaded LearningPackages into the database.');
    }
}

// Start server and connect to database
app.listen(port, async () => {
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
