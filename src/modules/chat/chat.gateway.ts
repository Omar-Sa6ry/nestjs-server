import { Server, Socket } from 'socket.io'
import { OnModuleInit } from '@nestjs/common'
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets'

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  onModuleInit () {
    this.server.on('connection', client => {
      console.log(`Client connected: ${client.id}`)
    })
  }

  // sent to single
  @SubscribeMessage('singleClient')
  singleClient (@MessageBody() data: { targetId: string; message: string }) {
    this.server.to(data.targetId).emit('singleClient', data.message)
  }

  // sent to group
  @SubscribeMessage('group')
  group (@MessageBody() message: any) {
    this.server.emit('group', message)
  }

  handleDisconnect (client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }
}
