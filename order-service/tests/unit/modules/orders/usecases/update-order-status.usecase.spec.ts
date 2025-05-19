import { NotFoundException } from "@nestjs/common";
import { UpdateOrderStatusUseCase } from "src/modules/orders/application/use-cases/update-order-status.use-case";
import { OrderEntity, OrderStatus } from "src/modules/orders/domain/entities/order.entity";
import { OrderRepository } from "src/modules/orders/domain/repositories/order.repository";

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      updateStatus: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new UpdateOrderStatusUseCase(orderRepository);
  });

  it('debe actualizar el estado de un pedido correctamente', async () => {
    const orderId = 'pedido-123';
    const existing = new OrderEntity(
      orderId,
      'user-123',
      OrderStatus.PENDING,
      new Date(),
      new Date(),
    );

    orderRepository.findById.mockResolvedValue(existing);
    orderRepository.updateStatus.mockResolvedValue(
        new OrderEntity(
            existing.id,
            existing.userId,
            OrderStatus.COMPLETED,
            existing.createdAt,
            new Date(),
        ),
    );

    const result = await useCase.execute(orderId, OrderStatus.COMPLETED);

    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(orderRepository.updateStatus).toHaveBeenCalledWith(orderId, OrderStatus.COMPLETED);
    expect(result.status).toBe(OrderStatus.COMPLETED);
  });

  it('debe lanzar NotFoundException si el pedido no existe', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('pedido-inexistente', OrderStatus.PROCESSING),
    ).rejects.toThrow(NotFoundException);

    expect(orderRepository.findById).toHaveBeenCalledWith('pedido-inexistente');
    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });
});