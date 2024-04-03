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
  controllers: [UserController],
  providers: [UserService,JwtService,JwtStrategy]
})
export class UserModule {}
