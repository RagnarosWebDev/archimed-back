import { ServeStaticModule } from '@nestjs/serve-static';

export default [
  ServeStaticModule.forRoot({
    rootPath: 'images',
    serveRoot: '/images',
  }),
];
