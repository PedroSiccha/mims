import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { USER_REPOSITORY } from "src/shared/tokens";

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<{ id: string; email: string; name: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}