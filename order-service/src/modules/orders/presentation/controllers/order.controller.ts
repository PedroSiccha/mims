import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.use-case";
import { CreateOrderDto } from "../../application/dto/create-order.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetOrdersByUserUseCase } from "../../application/use-cases/get-orders-by-user.use-case";
import { UpdateOrderStatusUseCase } from "../../application/use-cases/update-order-status.use-case";
import { UpdateOrderStatusDto } from "../../application/dto/update-status.dto";

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrdersByUserUseCase: GetOrdersByUserUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreateOrderDto) {
    return this.createOrderUseCase.execute(dto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Obtener pedidos por ID de usuario' })
  @ApiResponse({ status: 200, description: 'Listado de pedidos' })
  getByUser(@Param('id') userId: string) {
    return this.getOrdersByUserUseCase.execute(userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado del pedido' })
  @ApiResponse({ status: 200, description: 'Pedido actualizado' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.updateOrderStatusUseCase.execute(id, dto.status);
  }

}