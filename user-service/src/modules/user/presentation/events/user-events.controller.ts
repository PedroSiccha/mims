import { PrismaService } from "@/modules/user/infrastructure/repositories/prisma.service";
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class UserEventsController {
  constructor(private readonly prisma: PrismaService) {}

  @MessagePattern('validate-user')
  async handleValidateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return { exists: !!user };
  }
}