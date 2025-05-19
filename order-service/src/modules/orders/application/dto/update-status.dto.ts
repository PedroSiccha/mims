import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { OrderStatus } from "../../domain/entities/order.entity";

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'PROCESSING', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}