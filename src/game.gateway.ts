import { Test } from '@nestjs/testing';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway
// implements OnGatewayConnection, OnGatewayDisconnect 
{
	@WebSocketServer() server: Server;

	handleConnection(client: Socket) {
		console.log('Client connected:', client.id);

		client.on('keydown', (keyCode: number) => {
			// 클라이언트로부터 전달받은 키 다운 이벤트 처리
			console.log('Keydown event:', keyCode);
			// 로직 추가: 패들을 이동시키거나 게임 동작 처리 등

			// 다른 클라이언트에게 이벤트 전달
			this.server.emit('keydown', { clientId: client.id, keyCode });
		});
	}

	// 	client.on('keyup', (keyCode: number) => {
	// 		// 클라이언트로부터 전달받은 키 업 이벤트 처리
	// 		console.log('Keyup event:', keyCode);
	// 		// 로직 추가: 패들 이동 멈추기 등

	// 		// 다른 클라이언트에게 이벤트 전달
	// 		this.server.emit('keyup', { clientId: client.id, keyCode });
	// 	});
	// }
	@SubscribeMessage("message")
	name_ft(
		@MessageBody() message: string
	) {
		console.log('Client next:', message);
		this.server.emit("message", message);
		// 로직 추가: 클라이언트가 연결 해제되었을 때 처리할 내용
	}

	

}
