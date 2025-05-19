import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { OrderRepository } from "../../domain/repositories/order.repository";
import { OrderEntity, OrderStatus } from "../../domain/entities/order.entity";
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderDto } from "../dto/create-order.dto";
import { UserClientService } from "src/shared/services/user-client.service";

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    private readonly userClient: UserClientService,
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderEntity> {
    const isValid = await this.userClient.validateUser(dto.userId);
    if (!isValid) {
      throw new BadRequestException('Usuario no válido');
    }
    const now = new Date();
    const order = new OrderEntity(uuidv4(), dto.userId, OrderStatus.PENDING, now, now);
    return this.orderRepository.create(order);
  }
}