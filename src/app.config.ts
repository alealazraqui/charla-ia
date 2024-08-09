// app.config.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupApp = (app: INestApplication): void => {
  // Aquí va tu lógica de configuración
  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };
  app.enableCors(corsOptions);
  setupSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilitar la transformación automática
      transformOptions: {
        enableImplicitConversion: true, // Habilitar la conversión implícita
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};

export const setupTestingApp = (app: INestApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilitar la transformación automática
      transformOptions: {
        enableImplicitConversion: true, // Habilitar la conversión implícita
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};

const setupSwagger = (app: INestApplication): void => {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Base Template')
    .setDescription('This is a base template CQRS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
};
