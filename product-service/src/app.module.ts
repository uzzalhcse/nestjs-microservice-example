import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:"USER",
        transport:Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: 'user_queue',
          noAck: false,
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
