import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.config';

interface PackageAttributes {
  id?: number;
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  difficultyLevel: number;
  userId: number;
}

export class LearningPackage extends Model<PackageAttributes> implements PackageAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public targetAudience!: string;
  public difficultyLevel!: number;
  public userId!: number;
}

LearningPackage.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    targetAudience: { type: DataTypes.STRING, allowNull: false },
    difficultyLevel: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    modelName: 'LearningPackage'
  }
);

