import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remueve la data del body que no está en el DTO, pero no manda un error
      forbidNonWhitelisted: true, // devuelve error si hay mas propiedades de las definiodas en el DTO, pero no manda
      transformOptions: {
        exposeUnsetFields: false, // evita que el undefined elimine los campos opcionales del patch
        enableImplicitConversion: true,
      },
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
