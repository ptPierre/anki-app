import { Router, Request, Response } from 'express';
import { LearningPackage } from '../models/learningPackage.model';
import { Op } from 'sequelize';
import { sequelize } from '../config/database.config';

const router = Router();

interface PackageStats {
  date: string;
  count: string | number;
}


/**
 * @swagger
 * /api/package/stats/creation-history:
 *   get:
 *     summary: Get package creation statistics
 *     description: Fetches the creation history of learning packages for the last 7 days.
 *     parameters:
 *       - in: query
 *         name: userId
 *         type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Returns the creation history of packages
 *       400:
 *         description: Invalid userId
 *       500:
 *         description: Error fetching statistics
 */
// Stats route should come before any routes with parameters
router.get('/stats/creation-history', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    console.log('Stats requested for userId:', userId);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    console.log('Date range:', { startDate, endDate });

    const packages = await LearningPackage.findAll({
      where: {
        userId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('count', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('date', sequelize.col('createdAt'))],
      raw: true
    }) as unknown as PackageStats[];
    
    console.log('Raw packages data:', packages);

    const result = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const existingData = packages.find(p => p.date === dateStr);
      result.push({
        date: dateStr,
        count: existingData ? Number(existingData.count) : 0
      });
    }
    
    console.log('Final result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching package creation history:', error);
    res.status(500).send('Error fetching statistics');
  }
});


/**
 * @swagger
 * /api/package:
 *   get:
 *     summary: Get all learning packages
 *     description: Fetches all learning packages for a specific user.
 *     parameters:
 *       - in: query
 *         name: userId
 *         type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Returns a list of learning packages
 *       400:
 *         description: Invalid userId
 *       500:
 *         description: Error fetching packages
 */
// Get all learning packages for a user
router.get('/', async (req: Request, res: Response) => {
    try {
        const userId = Number(req.query.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid userId');
        }

        const packages = await LearningPackage.findAll({
            where: { userId }
        });
        res.json(packages);
    } catch (err) {
        res.status(500).send('Error fetching learning packages');
    }
});

/**
 * @swagger
 * /api/package/{id}:
 *   get:
 *     summary: Get a learning package by ID
 *     description: Fetches a learning package by its ID for a specific user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the learning package
 *       - in: query
 *         name: userId
 *         type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Returns the learning package
 *       400:
 *         description: Invalid userId
 *       404:
 *         description: Learning package not found
 *       500:
 *         description: Error fetching the learning package
 */
// Get a learning package by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userId = Number(req.query.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid userId');
        }

        const pkg = await LearningPackage.findOne({
            where: { id, userId }
        });

        if (pkg) {
            res.json(pkg);
        } else {
            res.status(404).send(`Entity not found for id: ${id}`);
        }
    } catch (err) {
        res.status(500).send('Error fetching the learning package');
    }
});



/**
 * @swagger
 * /api/package:
 *   post:
 *     summary: Create a new learning package
 *     description: Creates a new learning package for a user.
 *     parameters:
 *       - in: body
 *         name: package
 *         description: The learning package to create
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             category:
 *               type: string
 *             targetAudience:
 *               type: string
 *             difficultyLevel:
 *               type: integer
 *             userId:
 *               type: integer
 *     responses:
 *       201:
 *         description: Learning package successfully created
 *       400:
 *         description: Missing mandatory fields
 *       500:
 *         description: Error creating the learning package
 */

// Create a new learning package
router.post('/', async (req: Request, res: Response) => {
    const { title, description, category, targetAudience, difficultyLevel, userId } = req.body;

    if (!title || !description || !category || !targetAudience || !difficultyLevel || !userId) {
        return res.status(400).send('Missing mandatory fields');
    }

    try {
        const newPackage = await LearningPackage.create({ 
            title, 
            description, 
            category, 
            targetAudience, 
            difficultyLevel,
            userId 
        });
        res.status(201).json(newPackage);
    } catch (err) {
        res.status(500).send('Error creating the learning package');
    }
});




/**
 * @swagger
 * /api/package/{id}:
 *   put:
 *     summary: Update a learning package
 *     description: Updates an existing learning package for a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the learning package to update
 *       - in: body
 *         name: package
 *         description: The updated learning package data
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             category:
 *               type: string
 *             targetAudience:
 *               type: string
 *             difficultyLevel:
 *               type: integer
 *             userId:
 *               type: integer
 *     responses:
 *       200:
 *         description: Learning package updated successfully
 *       400:
 *         description: Invalid userId or missing fields
 *       404:
 *         description: Learning package not found
 *       500:
 *         description: Error updating the learning package
 */
// Update an existing learning package
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userId = Number(req.body.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid userId');
        }

        const pkg = await LearningPackage.findOne({
            where: { id, userId }
        });

        if (!pkg) {
            return res.status(404).send(`Entity not found for id: ${id}`);
        }

        await pkg.update(req.body);
        res.status(200).json(pkg);
    } catch (err) {
        res.status(500).send('Error updating the learning package');
    }
});



/**
 * @swagger
 * /api/package/{id}:
 *   delete:
 *     summary: Delete a learning package
 *     description: Deletes a learning package for a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the learning package to delete
 *       - in: query
 *         name: userId
 *         type: integer
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       204:
 *         description: Learning package deleted successfully
 *       400:
 *         description: Invalid userId
 *       404:
 *         description: Learning package not found
 *       500:
 *         description: Error deleting the learning package
 */
// Delete a learning package
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userId = Number(req.query.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid userId');
        }

        const pkg = await LearningPackage.findOne({
            where: { id, userId }
        });

        if (!pkg) {
            return res.status(404).send(`Entity not found for id: ${id}`);
        }

        await pkg.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).send('Error deleting the learning package');
    }
});

export default router;