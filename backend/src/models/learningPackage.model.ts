import { DataTypes, Model, ForeignKey } from 'sequelize';
import { sequelize } from '../config/database.config';
import { User } from './user.model';

export class LearningPackage extends Model {
    declare userId: ForeignKey<User['id']>;
}

LearningPackage.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, allowNull: false },
        targetAudience: { type: DataTypes.STRING, allowNull: false },
        difficultyLevel: { type: DataTypes.INTEGER, allowNull: false },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
          },
    },
    {
        sequelize,
        modelName: 'LearningPackage',
        tableName: 'LearningPackages',
        timestamps: false,
    }
);

