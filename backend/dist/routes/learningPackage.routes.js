"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learningPackage_model_1 = require("../models/learningPackage.model");
const sequelize_1 = require("sequelize");
const database_config_1 = require("../config/database.config");
const router = (0, express_1.Router)();
// Stats route should come before any routes with parameters
router.get('/stats/creation-history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.query.userId);
        console.log('Stats requested for userId:', userId);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);
        console.log('Date range:', { startDate, endDate });
        const packages = yield learningPackage_model_1.LearningPackage.findAll({
            where: {
                userId,
                createdAt: {
                    [sequelize_1.Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                [database_config_1.sequelize.fn('date', database_config_1.sequelize.col('createdAt')), 'date'],
                [database_config_1.sequelize.fn('count', database_config_1.sequelize.col('id')), 'count']
            ],
            group: [database_config_1.sequelize.fn('date', database_config_1.sequelize.col('createdAt'))],
            raw: true
        });
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
    }
    catch (error) {
        console.error('Error fetching package creation history:', error);
        res.status(500).send('Error fetching statistics');
    }
}));
// Get all learning packages for a user
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.query.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid userId');
        }
        const packages = yield learningPackage_model_1.LearningPackage.findAll({
            where: { userId }
        });
        res.json(packages);
    }
    catch (err) {
        res.status(500).send('Error fetching learning packages');
    }
}));
// Get a learning package by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const userId = Number(req.query.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid userId');
        }
        const pkg = yield learningPackage_model_1.LearningPackage.findOne({
            where: { id, userId }
        });
        if (pkg) {
            res.json(pkg);
        }
        else {
            res.status(404).send(`Entity not found for id: ${id}`);
        }
    }
    catch (err) {
        res.status(500).send('Error fetching the learning package');
    }
}));
// Create a new learning package
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, category, targetAudience, difficultyLevel, userId } = req.body;
    if (!title || !description || !category || !targetAudience || !difficultyLevel || !userId) {
        return res.status(400).send('Missing mandatory fields');
    }
    try {
        const newPackage = yield learningPackage_model_1.LearningPackage.create({
            title,
            description,
            category,
            targetAudience,
            difficultyLevel,
            userId
        });
        res.status(201).json(newPackage);
    }
    catch (err) {
        res.status(500).send('Error creating the learning package');
    }
}));
// Update an existing learning package
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const userId = Number(req.body.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid userId');
        }
        const pkg = yield learningPackage_model_1.LearningPackage.findOne({
            where: { id, userId }
        });
        if (!pkg) {
            return res.status(404).send(`Entity not found for id: ${id}`);
        }
        yield pkg.update(req.body);
        res.status(200).json(pkg);
    }
    catch (err) {
        res.status(500).send('Error updating the learning package');
    }
}));
// Delete a learning package
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const userId = Number(req.query.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid userId');
        }
        const pkg = yield learningPackage_model_1.LearningPackage.findOne({
            where: { id, userId }
        });
        if (!pkg) {
            return res.status(404).send(`Entity not found for id: ${id}`);
        }
        yield pkg.destroy();
        res.status(204).send();
    }
    catch (err) {
        res.status(500).send('Error deleting the learning package');
    }
}));
exports.default = router;
