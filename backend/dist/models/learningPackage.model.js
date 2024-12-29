"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningPackage = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../config/database.config");
class LearningPackage extends sequelize_1.Model {
}
exports.LearningPackage = LearningPackage;
LearningPackage.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    category: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    targetAudience: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    difficultyLevel: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
    },
}, {
    sequelize: database_config_1.sequelize,
    modelName: 'LearningPackage',
    tableName: 'LearningPackages',
    timestamps: false,
});
