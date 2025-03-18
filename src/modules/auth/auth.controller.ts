import { Controller, Post, Body, HttpException, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SetCookieInterceptor } from 'src/shared/interceptors/set-cookie.interceptor';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(SetCookieInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto) {
        try {
            const user = await this.authService.validateUser(loginDto.username, loginDto.password);            
            if (!user) {
                throw new HttpException({ message: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);
            }
            return await this.authService.login(user);
        } catch (err) {
            throw new HttpException({ message: err.message }, HttpStatus.UNAUTHORIZED);
        }
    }
}
