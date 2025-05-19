import { Module } from "@nestjs/common";
import { CreateUserUseCase } from "src/modules/user/application/use-cases/create-user.usecase";
import { GetUserUseCase } from "src/modules/user/application/use-cases/get-user.usecase";
import { JwtStrategy } from "src/modules/auth/infrastructure/jwt.strategy";
import { PrismaService } from "src/modules/user/infrastructure/repositories/prisma.service";
import { USER_REPOSITORY } from "src/shared/tokens";
import { UserController } from "./presentation/controllers/user.controller";
import { UserPrismaRepository } from "./infrastructure/database/prisma/user-prisma.repository";
import { UserEventsController } from "./presentation/events/user-events.controller";

@Module({
  controllers: [UserController, UserEventsController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [USER_REPOSITORY, CreateUserUseCase, GetUserUseCase],
})
export class UserModule {}