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
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const learningPackage_routes_1 = __importDefault(require("./routes/learningPackage.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const database_config_1 = require("./config/database.config");
const cors_1 = __importDefault(require("cors"));
const learningPackage_model_1 = require("./models/learningPackage.model");
const user_model_1 = require("./models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const websocket_handlers_1 = require("./websocket/websocket.handlers");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/package', learningPackage_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
// Health check endpoint
app.get('/api/liveness', (req, res) => {
    res.status(200).send('OK');
});
// Function to preload data into the database
function preloadData() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create demo user if it doesn't exist
        const demoUser = yield user_model_1.User.findOne({ where: { username: 'demo' } });
        if (!demoUser) {
            const hashedPassword = yield bcrypt_1.default.hash('demo123', 10);
            yield user_model_1.User.create({
                username: 'demo',
                password: hashedPassword
            });
            console.log('Demo user created');
        }
        // Create demo packages if none exist
        const count = yield learningPackage_model_1.LearningPackage.count();
        if (count === 0) {
            const user = yield user_model_1.User.findOne({ where: { username: 'demo' } });
            yield learningPackage_model_1.LearningPackage.bulkCreate([
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
    });
}
// Setup WebSocket handlers
(0, websocket_handlers_1.setupWebSocketHandlers)(io);
// Add this log
io.on('connection', (socket) => {
    console.log('Client connected to WebSocket');
});
// Start server and connect to database
const port = 3000;
httpServer.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        yield database_config_1.sequelize.authenticate();
        console.log('Database connected successfully.');
        // Drop and recreate tables
        yield database_config_1.sequelize.sync({ force: true });
        console.log('Database tables dropped and recreated.');
        // Preload initial data
        yield preloadData();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    console.log(`Server is running at http://localhost:${port}`);
}));
