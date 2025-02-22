import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import {ChatModule} from "./chat/chat.module";


@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal:true
    }),
    AuthModule,
    OrderModule,
    ProductModule,
      ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
