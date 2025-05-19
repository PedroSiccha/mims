import { OrderEntity, OrderStatus } from "../entities/order.entity";

export abstract class OrderRepository {
  abstract create(order: OrderEntity): Promise<OrderEntity>;

  abstract findByUserId(userId: string): Promise<OrderEntity[]>;

  abstract updateStatus(orderId: string, status: OrderStatus): Promise<OrderEntity | null>;

  abstract findById(orderId: string): Promise<OrderEntity | null>;
}