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
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'user-consumer',
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
