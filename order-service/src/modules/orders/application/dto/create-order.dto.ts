import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-del-usuario', description: 'ID del usuario que realiza el pedido' })
  @IsUUID()
  userId: string;
}