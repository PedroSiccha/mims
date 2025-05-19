import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class UserClientService implements OnModuleInit {
  private client: ClientProxy;

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats:4222'],
      },
    });
  }

  async validateUser(userId: string): Promise<boolean> {
    const response = await lastValueFrom(this.client.send('validate-user', userId));
    return response.exists;
  }
}