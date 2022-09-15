import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import constants from '../shared/security/constants';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { UserService } from '../user/user.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard'


@Module({
  
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
    })
  ],
  providers: [AuthService, UserService,RolesGuard,JwtAuthGuard, JwtService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
