import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  room: string;
}

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  event: string;
  
  @IsNotEmpty()
  data: any;
  
  @IsString()
  @IsOptional()
  room?: string;
}