import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';

@Module({
  imports:[
    ClientsModule.register([
      {
        name:"ORDER",
        transport:Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'order_queue',
          noAck: false,
          queueOptions: {
            durable: false
          },
        },
      },
    ])
  ],
  controllers: [OrderController]
})
export class OrderModule {}
