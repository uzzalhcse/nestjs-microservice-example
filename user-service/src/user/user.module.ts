import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtService } from './jwt/jwt.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([{name:User.name, schema:UserSchema}]),
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
  controllers: [UserController],
  providers: [UserService,JwtService,JwtStrategy]
})
export class UserModule {}
