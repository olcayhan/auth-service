import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'this is secret key',
      signOptions: { expiresIn: '60m' },
    }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
