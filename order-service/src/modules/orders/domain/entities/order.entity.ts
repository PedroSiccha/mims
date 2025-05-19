export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

export class OrderEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public status: OrderStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  updateStatus(newStatus: OrderStatus) {
    this.status = newStatus;
  }
}