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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocketHandlers = setupWebSocketHandlers;
const learningPackage_model_1 = require("../models/learningPackage.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_routes_1 = require("../routes/auth.routes");
function setupWebSocketHandlers(io) {
    io.use((socket, next) => {
        console.log('Auth middleware - checking token');
        const token = socket.handshake.auth.token;
        console.log('Received token:', token);
        if (!token) {
            console.log('No token provided');
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, auth_routes_1.JWT_SECRET);
            console.log('Successfully decoded token:', decoded);
            socket.data.user = decoded;
            next();
        }
        catch (err) {
            console.error('Token verification failed. Token:', token, 'Error:', err);
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        console.log('Client connected, user:', socket.data.user);
        socket.on('export-packages', () => __awaiter(this, void 0, void 0, function* () {
            console.log('Received export-packages event');
            try {
                const userId = socket.data.user.id;
                console.log('Fetching packages for user:', userId);
                const packages = yield learningPackage_model_1.LearningPackage.findAll({
                    where: { userId },
                    raw: true
                });
                // Convert to CSV format
                const csvHeader = 'Title,Description,Category,Target Audience,Difficulty Level\n';
                const csvRows = packages.map(pkg => `"${pkg.title}","${pkg.description}","${pkg.category}","${pkg.targetAudience}",${pkg.difficultyLevel}`).join('\n');
                const csvContent = csvHeader + csvRows;
                // Send the CSV data back to the client
                socket.emit('export-complete', {
                    data: csvContent,
                    filename: `learning-packages-${new Date().toISOString()}.csv`
                });
            }
            catch (error) {
                console.error('Export error:', error);
                socket.emit('export-error', { message: 'Error exporting packages' });
            }
        }));
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}
