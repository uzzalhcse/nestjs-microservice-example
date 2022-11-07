import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionFilter } from './auth/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  app.useGlobalFilters(new ExceptionFilter());
  const configService = app.get(ConfigService);
  const PORT = configService.get("PORT")
  app.useGlobalPipes(new ValidationPipe());


  const config = new DocumentBuilder()
  .setTitle('Microservice Ecommerce')
  .setDescription('')
  .setVersion('1.0')
  .addTag('ecom')
  .addBearerAuth()
  .build();



  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  await app.listen(PORT);
}
bootstrap();
