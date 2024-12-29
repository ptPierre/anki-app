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
const router = (0, express_1.Router)();
// Get all learning packages for a user
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).send('UserId is required');
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
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).send('UserId is required');
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
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).send('UserId is required');
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
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).send('UserId is required');
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
