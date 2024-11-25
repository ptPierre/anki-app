import express, { Request, Response } from 'express';
import learningPackageRoutes from './routes/learningPackage.routes';
import { sequelize } from './config/database.config';
import { LearningPackage } from './models/learningPackage.model';
import cors from 'cors';


const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use('/api/package', learningPackageRoutes);


app.get('/api/liveness', (req: Request, res: Response) => {
    res.status(200).send('OK');
});


// Function to preload data into the database
async function preloadData() {
    const count = await LearningPackage.count();
    if (count === 0) {
        await LearningPackage.bulkCreate([
            {
                title: 'Learn TypeScript',
                description: 'Basics of TypeScript',
                category: 'Programming',
                targetAudience: 'Developers',
                difficultyLevel: 5,
            },
            {
                title: 'Learn NodeJs',
                description: 'Backend Development',
                category: 'Programming',
                targetAudience: 'Developers',
                difficultyLevel: 6,
            },
            {
                title: 'Learn Html',
                description: 'Basics of Web',
                category: 'Web Development',
                targetAudience: 'Beginners',
                difficultyLevel: 2,
            },
            {
                title: 'Learn Angular',
                description: 'Frontend Framework',
                category: 'Programming',
                targetAudience: 'Frontend Developers',
                difficultyLevel: 8,
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

        // Synchronize database tables
        await sequelize.sync();

        // Preload initial data
        await preloadData();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    console.log(`Server is running at http://localhost:${port}`);
});
