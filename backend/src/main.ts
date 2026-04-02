import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT || 3000);
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3001';

  app.enableCors({
    origin: frontendOrigin,
  });
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
