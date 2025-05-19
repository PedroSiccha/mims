import { Injectable } from "@nestjs/common";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { PrismaService } from "../../repositories/prisma.service";

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const record = await this.prisma.user.create({
    data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return new User(record.id, record.name, record.email, record.password);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!record) return null;

    return new User(record.id, record.name, record.email, record.password);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!record) return null;

    return new User(record.id, record.name, record.email, record.password);
  }
}