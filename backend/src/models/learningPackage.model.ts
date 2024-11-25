import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.config';

export class LearningPackage extends Model {}

LearningPackage.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false },
        targetAudience: { type: DataTypes.STRING, allowNull: false },
        difficultyLevel: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        modelName: 'LearningPackage',
        tableName: 'LearningPackages',
        timestamps: false,
    }
);

sequelize.sync();
