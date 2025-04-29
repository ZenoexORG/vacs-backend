import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { User } from './entities/user.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly paginationService: PaginationService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { id: createUserDto.id },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const newUser = this.usersRepository.create(createUserDto);
    this.notificationsService.notifyUserCreated(newUser);
    return this.usersRepository.save(newUser);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.usersRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        order: { id: 'ASC' },
      },
    );
    return {
      data: result.data,
      meta: result.meta,
    };    
  }  

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },      
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('User with this ID already exists');
    }
    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    this.notificationsService.notifyUserUpdated(updatedUser);
    return updatedUser;
  }

  async remove(id: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (!existingUser || existingUser.id !== id) {
      throw new NotFoundException('User not found');      
    }
    await this.usersRepository.delete(id);
    this.notificationsService.notifyUserDeleted(existingUser);    
  }
}