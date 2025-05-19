import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from "src/shared/tokens";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: { name: string; email: string; password: string }): Promise<{ id: string; name: string; email: string }> {
    const userExists = await this.userRepository.findByEmail(input.email);
    if (userExists) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = new User('', input.name, input.email, hashedPassword);

    const created = await this.userRepository.create(user);

    return {
      id: created.id,
      name: created.name,
      email: created.email,
    };
  }
}