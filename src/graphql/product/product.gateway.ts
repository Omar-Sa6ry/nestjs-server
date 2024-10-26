import { Server, Socket } from 'socket.io'
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'

@WebSocketGateway({ cors: true })
export class ProductGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server

  handleConnection (client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect (client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }
}
