import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product.controller';


@Module({
  imports:[
    ClientsModule.register([
      {
        name:"PRODUCT",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'product-consumer',
          },
        },
      },
    ])
  ],
  controllers: [ProductController]
})
export class ProductModule {}
