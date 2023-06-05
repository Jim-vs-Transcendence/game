import { Test } from '@nestjs/testing';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlayerData, Players, Data, startFlag } from './player.data';

@WebSocketGateway()
export class GameGateway
// implements OnGatewayConnection, OnGatewayDisconnect 
{
	private players: Players[] = [];

	private oneGame: Players = new Players();

	private leftReady: boolean = false;
	private RightReady: boolean = false;

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
		if (!this.oneGame.player1) { // check
			this.oneGame.player1 = playerData;
		}
		else {
			this.oneGame.player2 = playerData;
			this.players.push(this.oneGame);
			console.log('I certainly send the fucking message');
			this.server.to(this.oneGame.player1.socket).emit('start', false);
			this.server.to(this.oneGame.player2.socket).emit('start', true);
		}

		// key number가 필요 없을 듯.
		// 화살표 아래 버튼 눌렀을 때
		client.on('keydown', (data: { clientId: string, key: number, startFlag: boolean }) => {
			const { clientId, key, startFlag } = data;
			console.log('is key downed? ', data);
			if (!data.startFlag) {
				if (this.oneGame.player1.socket === data.clientId) {
					this.oneGame.player1.paddleY = -30;
				}
				else {
					this.oneGame.player2.paddleY = -30;
				}
			}
			else {
				if (this.oneGame.player1.socket === data.clientId) {
					this.leftReady = true;
				}
				else {
					this.RightReady = true;
				}
				if (this.leftReady && this.RightReady) {
					this.server.to(this.oneGame.player1.socket).emit('ready', true);
					this.server.to(this.oneGame.player2.socket).emit('ready', true);
				}
			}

			let left: Data = new Data();
			let right: Data = new Data();
			console.log(this.players.length);
			if (this.players.length === 1) {
				console.log(this.oneGame.player1.socket, ' ', this.oneGame.player2.socket);

				left.p1Paddle = this.oneGame.player1.paddleY;
				left.p2Paddle = this.oneGame.player2.paddleY;

				right.p1Paddle = this.oneGame.player2.paddleY;
				right.p2Paddle = this.oneGame.player1.paddleY;

				this.server.to(this.oneGame.player1.socket).emit('message', left);
				this.server.to(this.oneGame.player2.socket).emit('message', right);
				this.oneGame.player1.paddleY = 0;
				this.oneGame.player2.paddleY = 0;
			}
		})

		// 화살표 위 버튼 눌렀을 때
		client.on('keyup', (data: { clientId: string, key: number }) => {
			const { clientId, key } = data;
			console.log('is key up? ', data);
			if (this.oneGame.player1.socket === data.clientId) {
				this.oneGame.player1.paddleY = 30;
			}
			else {
				this.oneGame.player2.paddleY = 30;
			}
			let left: Data = new Data();
			let right: Data = new Data();
			console.log(this.players.length);
			if (this.players.length === 1) {
				console.log(this.oneGame.player1.socket, ' ', this.oneGame.player2.socket);

				left.p1Paddle = this.oneGame.player1.paddleY;
				left.p2Paddle = this.oneGame.player2.paddleY;

				right.p1Paddle = this.oneGame.player2.paddleY;
				right.p2Paddle = this.oneGame.player1.paddleY;

				this.server.to(this.oneGame.player1.socket).emit('message', left);
				this.server.to(this.oneGame.player2.socket).emit('message', right);
				this.oneGame.player1.paddleY = 0;
				this.oneGame.player2.paddleY = 0;
			}
		})
	}
}
