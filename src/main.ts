import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as socketIo from 'socket.io';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	const server = app.getHttpServer();
	const io = new socketIo.Server(server, { cors: { origin: 'http://175.117.47.114:1414' } });

	// Socket.io 이벤트 및 로직을 처리하는 코드 작성

	await app.listen(3000);
}
bootstrap();
