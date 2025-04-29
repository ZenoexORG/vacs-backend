import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { EmployeesService } from '../employees/employees.service';
import { Logger } from '@nestjs/common';
import { NotificationEvents } from './constants/events.constants';

@WebSocketGateway({
	cors: {
		origin: process.env.CLIENT_URL || '*',
		credentials: true,
	},
	namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	private logger = new Logger('NotificationsGateway');

	constructor(
		private jwtService: JwtService,
		private employeesService: EmployeesService,
	) { }

	async handleConnection(client: Socket) {
		try {
			const token = client.handshake.auth.token ||
				client.handshake.headers.authorization?.split(' ')[1] ||
				client.handshake.headers.cookie
					?.split(';')
					.find(c => c.trim().startsWith('token='))
					?.split('=')[1];

			if (!token) {
				this.logger.error('No auth token provided');
				client.disconnect();
				return;
			}

			const payload = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET || 'super_safe_secret',
			});
			const employee = await this.employeesService.findOne(payload.sub);

			if (!employee) {
				this.logger.error(`Employee ${payload.sub} not found`);
				client.disconnect();
				return;
			}

			client.data.employee = {
				id: employee.id,
				username: employee.username,
				role: employee.role,
			};

			client.join(`employee_${employee.id}`);

			if (employee.role) {
				client.join(`role_${employee.role}`);
			}

			this.logger.log(`Client connected: ${client.id} (employee: ${employee.username})`);
		} catch (error) {
			this.logger.error(`WebSocket connection error: ${error.message}`);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage(NotificationEvents.JOIN_ROOM)
	handleJoinRoom(client: Socket, room: string) {
		client.join(room);
		return { event: NotificationEvents.JOINED_ROOM, data: room };
	}

	@SubscribeMessage(NotificationEvents.LEAVE_ROOM)
	handleLeaveRoom(client: Socket, room: string) {
		client.leave(room);
		return { event: NotificationEvents.LEFT_ROOM, data: room };
	}
}