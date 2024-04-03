import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'order-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
})
export class OrderModule {}
