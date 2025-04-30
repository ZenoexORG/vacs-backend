import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { Employee } from '../employees/entities/employee.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.employeesService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: Employee) {     
    const payload = {
      sub: user.id,
      fullname: `${user.name} ${user.last_name}`,
      role: user.role?.name,
    };
    const viewPermissions = user.role?.permissions
    ?.filter((permission) => permission.name.endsWith('view'))
    .map((permission) => permission.name) || [];

    const permissionsPayload = {
      viewPermissions: viewPermissions,
    }

    return {
      message: 'Login successful',
      token: this.jwtService.sign(payload),
      viewPermissions: this.jwtService.sign(permissionsPayload),
    };
  }
}
