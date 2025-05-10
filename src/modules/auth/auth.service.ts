import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { Employee } from '../employees/entities/employee.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.employeesService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: Employee) {
    const viewPermissions = user.role?.permissions?.map((permission) => permission.name)
      .filter(permission => permission.endsWith('view')) || [];

    const payload = {
      sub: user.id,
      fullname: `${user.name} ${user.last_name}`,
      role: user.role?.name,
    }

    return {
      message: 'Login successful',
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '4h'
      }),
      viewPermissions: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '4h'
      }),
    }
  }
}
