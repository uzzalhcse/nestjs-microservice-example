import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product.controller';


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
    ])
  ],
  controllers: [ProductController]
})
export class ProductModule {}
