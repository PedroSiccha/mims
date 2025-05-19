import { GetOrdersByUserUseCase } from "src/modules/orders/application/use-cases/get-orders-by-user.use-case";
import { OrderEntity, OrderStatus } from "src/modules/orders/domain/entities/order.entity";
import { OrderRepository } from "src/modules/orders/domain/repositories/order.repository";

describe('GetOrdersByUserUseCase', () => {
  let useCase: GetOrdersByUserUseCase;
  let orderRepository: jest.Mocked<OrderRepository>;

  beforeEach(() => {
    orderRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      updateStatus: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new GetOrdersByUserUseCase(orderRepository);
  });

  it('debe retornar los pedidos del usuario', async () => {
    const userId = 'user-abc';
    const order1 = new OrderEntity('order-1', userId, OrderStatus.PENDING, new Date(), new Date());
    const order2 = new OrderEntity('order-2', userId, OrderStatus.PROCESSING, new Date(), new Date());

    orderRepository.findByUserId.mockResolvedValue([order1, order2]);

    const result = await useCase.execute(userId);

    expect(orderRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toHaveLength(2);
    expect(result[0].userId).toBe(userId);
  });
});