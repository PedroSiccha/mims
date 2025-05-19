import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateUserUseCase } from "src/modules/user/application/use-cases/create-user.usecase";
import { GetUserUseCase } from "src/modules/user/application/use-cases/get-user.usecase";
import { JwtAuthGuard } from "src/modules/auth/infrastructure/jwt-auth.guard";
import { GetUser } from "src/modules/user/presentation/decorators/get-user.decorator";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Perfil del usuario retornado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getProfile(@GetUser() user: { userId: string }) {
    return this.getUserUseCase.execute(user.userId);
  }
}