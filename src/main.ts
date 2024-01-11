import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

const { PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Power pulse')
    .setDescription('The power-pulse API description')
    .setVersion('1.0')
    .addServer(process.env.BASE_URL, '')
    .addServer('http://localhost:3000/', 'Local environment')
    .addTag('users', 'Authorization endpoints')
    .addTag('products', 'Products endpoints')
    .addTag('exercises', 'Exercises endpoints')
    .addTag('diary', 'Diaries endpoints')
    .addTag('stats', 'Statistics endpoints')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.use(morgan('tiny'));
  await app.listen(PORT);
}
bootstrap();
