import { Test } from '@nestjs/testing';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayerData } from './player.data';

@WebSocketGateway()
export class GameGateway
// implements OnGatewayConnection, OnGatewayDisconnect 
{
	private players: PlayerData[] = [];
	private playerId = 1;

	@WebSocketServer() server: Server;


	private initPlayer(player: PlayerData, clientId: string, id: number) {
		player.socket = clientId;
		player.score = 0;
		player.P1paddleY = 0;
		player.P2paddleY = 0;
	}


	handleConnection(client: Socket) {
		console.log('Client connected:', client.id);

		const playerData: PlayerData = new PlayerData();
		this.initPlayer(playerData, client.id, this.playerId++);
		this.players.push(playerData);

		client.on('keydown', (data: { clientId: string, key: number }) => {
			const { clientId, key } = data;
			console.log('Who is this: ', data.clientId, data.key);
			const player = this.players.find(player => player.socket === data.clientId);
			if (player) {
				console.log(player.socket)
				if (data.key === 38)
					player.P1paddleY -= 30;
				else if (data.key === 40)
					player.P1paddleY += 30;
				// console.log('Player: ', player.socket);
				// console.log('test: ', player.P1paddleY);
				// console.log('=================');
			}
			else {
				console.log('we are fucked');
			}

			// if (this.players.length === 2) {
			// game start
			// console.log('Game started');
			this.server.to(this.players[0].socket).emit('message', player);
			this.server.to(this.players[1].socket).emit('message', player);

		});
		// console.log('wtf');

		// // ball 위치 계속 변경
		// console.log('Keydowned event:', keyCode);

	}
}

// @SubscribeMessage("message")
// name_ft(
// 		@MessageBody() message: string
// 	) {
// 	console.log('Client next:', message);
// 	this.server.emit("message", message);
// 	// 로직 추가: 클라이언트가 연결 해제되었을 때 처리할 내용
// }

