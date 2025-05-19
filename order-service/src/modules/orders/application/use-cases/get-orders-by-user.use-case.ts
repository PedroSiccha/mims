import { Inject, Injectable } from "@nestjs/common";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { OrderEntity } from "../../domain/entities/order.entity";

@Injectable()
export class GetOrdersByUserUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(userId: string): Promise<OrderEntity[]> {
    return this.orderRepository.findByUserId(userId);
  }
}