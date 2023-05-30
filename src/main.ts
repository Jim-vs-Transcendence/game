import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 정적 파일 서비스 활성화

  await app.listen(3000);
}
bootstrap();
