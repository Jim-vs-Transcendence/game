import { Test } from '@nestjs/testing';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayerData, Players, Data } from './player.data';

@WebSocketGateway()
export class GameGateway
// implements OnGatewayConnection, OnGatewayDisconnect 
{
	private players: Players[] = [];

	private canvasHeight: number = 800 * 0.8;
	private paddleHeight: number = this.canvasHeight * 0.2;

	private oneGame: Players = new Players();

	@WebSocketServer() server: Server;

	private initPlayer(player: PlayerData, clientId: string) {
		player.socket = clientId;
		player.score = 0;
		player.paddleY = 0;
	}

	handleConnection(client: Socket) {
		console.log('Client connected:', client.id);

		const playerData: PlayerData = new PlayerData();
		this.initPlayer(playerData, client.id);
		console.log(this.oneGame.player1 ? 'wt' : 'fuck?');
		if (!this.oneGame.player1) { // check
			console.log('no player1')
			this.oneGame.player1 = playerData;
		}
		else {
			console.log('is in');
			this.oneGame.player2 = playerData;
			this.players.push(this.oneGame);
		}

		// key number가 필요 없을 듯.
		// 화살표 아래 버튼 눌렀을 때
		client.on('keydown', (data: { clientId: string, key: number }) => {
			const { clientId, key } = data;
			console.log('is key downed? ', data);
			if (this.oneGame.player1.socket === data.clientId) {
				this.oneGame.player1.paddleY -= 30;
				if (this.oneGame.player1.paddleY <= 0) {
					this.oneGame.player1.paddleY = 0;
				}
			}
			else {
				this.oneGame.player2.paddleY -= 30;
				if (this.oneGame.player2.paddleY <= 0) {
					this.oneGame.player2.paddleY = 0;
				}
			}
			let tmp: Data = new Data();
			console.log(this.players.length);
			if (this.players.length === 1) {
				console.log(this.oneGame.player1.socket, ' ', this.oneGame.player2.socket);
				tmp.p1Paddle = this.oneGame.player1.paddleY;
				tmp.p2Paddle = this.oneGame.player2.paddleY;
				this.server.to(this.oneGame.player1.socket).emit('message', tmp);
				this.server.to(this.oneGame.player2.socket).emit('message', tmp);
			}
		})

		// 화살표 위 버튼 눌렀을 때
		client.on('keyup', (data: { clientId: string, key: number }) => {
			const { clientId, key } = data;
			console.log('is key up? ', data);
			if (this.oneGame.player1.socket === data.clientId) {
				this.oneGame.player1.paddleY += 30;
				if (this.oneGame.player1.paddleY >= this.canvasHeight - this.paddleHeight) {
					this.oneGame.player1.paddleY = this.canvasHeight - this.paddleHeight;
				}
			}
			else {
				this.oneGame.player2.paddleY += 30;
				if (this.oneGame.player2.paddleY >= this.canvasHeight - this.paddleHeight) {
					this.oneGame.player2.paddleY = this.canvasHeight - this.paddleHeight;
				}
			}
			let tmp: Data = new Data();
			console.log(this.players.length);
			if (this.players.length === 1) {
				console.log(this.oneGame.player1.socket, ' ', this.oneGame.player2.socket);
				tmp.p1Paddle = this.oneGame.player1.paddleY;
				tmp.p2Paddle = this.oneGame.player2.paddleY;
				this.server.to(this.oneGame.player1.socket).emit('message', tmp);
				this.server.to(this.oneGame.player2.socket).emit('message', tmp);
			}
		})


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

