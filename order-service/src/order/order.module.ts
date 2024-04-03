import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'product-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
