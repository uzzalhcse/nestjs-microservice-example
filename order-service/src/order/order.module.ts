import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from './prisma.service';

@Module({
  imports:[
    ClientsModule.register([
      {
        name:"PRODUCT",
        transport:Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'product_queue',
          noAck: false,
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService,PrismaService]
})
export class OrderModule {}
