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
const learningPackage_routes_1 = __importDefault(require("./routes/learningPackage.routes"));
const database_config_1 = require("./config/database.config");
const learningPackage_model_1 = require("./models/learningPackage.model");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/package', learningPackage_routes_1.default);
app.get('/api/liveness', (req, res) => {
    res.status(200).send('OK');
});
// Function to preload data into the database
function preloadData() {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield learningPackage_model_1.LearningPackage.count();
        if (count === 0) {
            yield learningPackage_model_1.LearningPackage.bulkCreate([
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
    });
}
// Start server and connect to database
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        yield database_config_1.sequelize.authenticate();
        console.log('Database connected successfully.');
        // Synchronize database tables
        yield database_config_1.sequelize.sync();
        // Preload initial data
        yield preloadData();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    console.log(`Server is running at http://localhost:${port}`);
}));
