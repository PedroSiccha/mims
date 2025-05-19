import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthenticateUserUseCase } from "src/modules/auth/application/use-cases/authenticate-user.usecase";
import { AuthController } from "src/modules/auth/presentation/controllers/auth.controller";
import { UserModule } from "../user/user.module";
import { TokenBlacklistService } from "src/modules/auth/infrastructure/token-blacklist.service";
import { JwtStrategy } from "src/modules/auth/infrastructure/jwt.strategy";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecreto',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthenticateUserUseCase, JwtStrategy, TokenBlacklistService],
  exports: [TokenBlacklistService],
})
export class AuthModule {}