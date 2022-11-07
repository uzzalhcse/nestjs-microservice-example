import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Global()
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
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
