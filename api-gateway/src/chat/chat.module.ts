import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'chat',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'chat-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ChatController],
})
export class ChatModule {}
