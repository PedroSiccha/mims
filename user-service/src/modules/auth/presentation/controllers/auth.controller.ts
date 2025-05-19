import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthenticateUserUseCase } from "src/modules/auth/application/use-cases/authenticate-user.usecase";
import { LoginDto } from "../dtos/login.dto";
import { JwtAuthGuard } from "src/modules/auth/infrastructure/jwt-auth.guard";
import { TokenBlacklistService } from "src/modules/auth/infrastructure/token-blacklist.service";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUseCase: AuthenticateUserUseCase,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() dto: LoginDto) {
    return this.authUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Sesión cerrada correctamente' })
  logout(@Req() req) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    this.tokenBlacklistService.add(token);

    return { message: 'Sesión finalizada correctamente' };
  }

}