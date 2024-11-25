import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('LearningFactDb', 'learningDbUser', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});
