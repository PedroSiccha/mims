import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { OrderEntity, OrderStatus } from "../../domain/entities/order.entity";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(order: OrderEntity): Promise<OrderEntity> {
    const data = await this.prisma.order.create({
      data: {
        id: order.id,
        userId: order.userId,
        status: order.status,
      },
    });

    return this.toEntity(data);
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(this.toEntity);
  }

  async findById(orderId: string): Promise<OrderEntity | null> {
    const data = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    return data ? this.toEntity(data) : null;
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<OrderEntity | null> {
    const data = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return data ? this.toEntity(data) : null;
  }

  private toEntity(data: any): OrderEntity {
    return new OrderEntity(
      data.id,
      data.userId,
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }
}