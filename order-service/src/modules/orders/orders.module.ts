import { Module } from "@nestjs/common";
import { OrderController } from "./presentation/controllers/order.controller";
import { CreateOrderUseCase } from "./application/use-cases/create-order.use-case";
import { OrderRepositoryImpl } from "./infrastructure/repositories/order.repository.impl";
import { PrismaService } from "src/prisma/prisma.service";
import { GetOrdersByUserUseCase } from "./application/use-cases/get-orders-by-user.use-case";
import { UpdateOrderStatusUseCase } from "./application/use-cases/update-order-status.use-case";
import { UserClientService } from "src/shared/services/user-client.service";

@Module({
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    PrismaService,
    GetOrdersByUserUseCase,
    UpdateOrderStatusUseCase,
    UserClientService,
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryImpl,
    },
  ],
})
export class OrdersModule {}