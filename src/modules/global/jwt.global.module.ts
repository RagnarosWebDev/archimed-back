import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export default [
  JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('PRIVATE_KEY'),
      signOptions: {
        expiresIn: '24h',
      },
    }),
    inject: [ConfigService],
  }),
];
