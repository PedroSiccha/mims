import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from "src/shared/tokens";

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const match = await bcrypt.compare(input.password, user.password);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token: access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}