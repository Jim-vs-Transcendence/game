import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        // 클라이언트 연결 이벤트 처리
        console.log('Client connected:', client.id);

        // 클라이언트에게 연결 성공 메시지 보내기
        client.emit('connected', { message: 'Connected to the server.' });
    }

    handleDisconnect(client: Socket) {
        // 클라이언트 연결 해제 이벤트 처리
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any) {
        // 클라이언트로부터 메시지 수신 이벤트 처리
        console.log('Received message:', payload);

        // 클라이언트에게 응답 메시지 보내기
        client.emit('response', { message: 'Message received.' });
    }
}
