import { Router, Request, Response } from 'express';
import { LearningPackage } from '../models/learningPackage.model';

const router = Router();

// Get all learning packages
router.get('/', async (req: Request, res: Response) => {
    try {
        const packages = await LearningPackage.findAll();
        res.json(packages);
    } catch (err) {
        res.status(500).send('Error fetching learning packages');
    }
});

// Get a learning package by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const pkg = await LearningPackage.findByPk(id);

        if (pkg) {
            res.json(pkg);
        } else {
            res.status(404).send(`Entity not found for id: ${id}`);
        }
    } catch (err) {
        res.status(500).send('Error fetching the learning package');
    }
});

// Create a new learning package
router.post('/', async (req: Request, res: Response) => {
    const { title, description, category, targetAudience, difficultyLevel } = req.body;

    if (!title || !description || !category || !targetAudience || !difficultyLevel) {
        return res.status(400).send('Missing mandatory fields');
    }

    try {
        const newPackage = await LearningPackage.create({ title, description, category, targetAudience, difficultyLevel });
        res.status(201).json(newPackage);
    } catch (err) {
        res.status(500).send('Error creating the learning package');
    }
});

// Update an existing learning package
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const pkg = await LearningPackage.findByPk(id);

        if (!pkg) {
            return res.status(404).send(`Entity not found for id: ${id}`);
        }

        await pkg.update(req.body);
        res.status(200).json(pkg);
    } catch (err) {
        res.status(500).send('Error updating the learning package');
    }
});

// Delete a learning package
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const pkg = await LearningPackage.findByPk(id);

        if (!pkg) {
            return res.status(404).send(`Entity not found for id: ${id}`);
        }

        await pkg.destroy();
        res.status(204).send(); // 204 No Content
    } catch (err) {
        res.status(500).send('Error deleting the learning package');
    }
});

// Get package summaries
router.get('/summaries', async (req: Request, res: Response) => {
    try {
        const summaries = await LearningPackage.findAll({ attributes: ['id', 'title'] });
        res.json(summaries);
    } catch (err) {
        res.status(500).send('Error fetching package summaries');
    }
});

export default router;
