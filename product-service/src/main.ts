
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: 'product_queue',
      noAck: false,
      queueOptions: {
        durable: false
      },
    },
  });
  await app.startAllMicroservices();
  //await app.listen(3002);
}
bootstrap();