import { CreateOrderDto } from "src/modules/orders/application/dto/create-order.dto";
import { CreateOrderUseCase } from "src/modules/orders/application/use-cases/create-order.use-case";
import { OrderEntity, OrderStatus } from "src/modules/orders/domain/entities/order.entity";
import { OrderRepository } from "src/modules/orders/domain/repositories/order.repository";

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      updateStatus: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new CreateOrderUseCase(orderRepository);
  });

  it('debe crear un pedido con status PENDING', async () => {
    const dto: CreateOrderDto = {
      userId: 'user-id-123',
    };

    const now = new Date();
    const createdOrder = new OrderEntity(
      'order-id-123',
      dto.userId,
      OrderStatus.PENDING,
      now,
      now
    );

    orderRepository.create.mockResolvedValue(createdOrder);

    const result = await useCase.execute(dto);

    expect(orderRepository.create).toHaveBeenCalled();
    expect(result).toEqual(createdOrder);
    expect(result.status).toBe(OrderStatus.PENDING);
  });
});