import { CreateOrderDto } from "src/modules/orders/application/dto/create-order.dto";
import { UpdateOrderStatusDto } from "src/modules/orders/application/dto/update-status.dto";
import { CreateOrderUseCase } from "src/modules/orders/application/use-cases/create-order.use-case";
import { GetOrdersByUserUseCase } from "src/modules/orders/application/use-cases/get-orders-by-user.use-case";
import { UpdateOrderStatusUseCase } from "src/modules/orders/application/use-cases/update-order-status.use-case";
import { OrderEntity, OrderStatus } from "src/modules/orders/domain/entities/order.entity";
import { OrderController } from "src/modules/orders/presentation/controllers/order.controller";

describe('OrderController', () => {
  let controller: OrderController;
  let createOrderUseCase: jest.Mocked<CreateOrderUseCase>;
  let getOrdersByUserUseCase: jest.Mocked<GetOrdersByUserUseCase>;
  let updateOrderStatusUseCase: jest.Mocked<UpdateOrderStatusUseCase>;

  beforeEach(() => {
    createOrderUseCase = {
      execute: jest.fn(),
    } as any;

    getOrdersByUserUseCase = {
      execute: jest.fn(),
    } as any;

    updateOrderStatusUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new OrderController(
      createOrderUseCase,
      getOrdersByUserUseCase,
      updateOrderStatusUseCase
    );
  });

  it('debe delegar a CreateOrderUseCase en POST /orders', async () => {
    const dto: CreateOrderDto = { userId: 'user-123' };
    const mockOrder = new OrderEntity('order-1', dto.userId, OrderStatus.PENDING, new Date(), new Date());

    createOrderUseCase.execute.mockResolvedValue(mockOrder);

    const result = await controller.create(dto);

    expect(createOrderUseCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockOrder);
  });

  it('debe delegar a GetOrdersByUserUseCase en GET /orders/user/:id', async () => {
    const userId = 'user-xyz';
    const mockOrders = [
      new OrderEntity('order-1', userId, OrderStatus.PENDING, new Date(), new Date()),
    ];

    getOrdersByUserUseCase.execute.mockResolvedValue(mockOrders);

    const result = await controller.getByUser(userId);

    expect(getOrdersByUserUseCase.execute).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockOrders);
  });

  it('debe delegar a UpdateOrderStatusUseCase en PATCH /orders/:id/status', async () => {
    const orderId = 'order-1';
    const dto: UpdateOrderStatusDto = { status: OrderStatus.COMPLETED };

    const updated = new OrderEntity(
      orderId,
      'user-abc',
      OrderStatus.COMPLETED,
      new Date(),
      new Date()
    );

    updateOrderStatusUseCase.execute.mockResolvedValue(updated);

    const result = await controller.updateStatus(orderId, dto);

    expect(updateOrderStatusUseCase.execute).toHaveBeenCalledWith(orderId, dto.status);
    expect(result).toEqual(updated);
  });

});