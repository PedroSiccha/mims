import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { OrderStatus } from "../../domain/entities/order.entity";

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(orderId: string, status: OrderStatus) {
    const existing = await this.orderRepository.findById(orderId);
    if (!existing) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return this.orderRepository.updateStatus(orderId, status);
  }
}