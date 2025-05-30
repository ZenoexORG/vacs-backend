import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly API_KEY = process.env.DEVICE_API_KEY || 'the-device-api-key';
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('X-API-KEY');
    if (!apiKey || apiKey !== this.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}