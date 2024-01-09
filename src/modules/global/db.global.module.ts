import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../models';
import { User } from '../../models/user/user.model';

export default [
  SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    models: models,
    //sync: { force: true, alter: false },
    autoLoadModels: true,
  }),
];

export const globalModelsModule = [SequelizeModule.forFeature([User])];
