import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { User } from './entities/user.entity';
import { PaginationService } from 'src/shared/services/pagination.service';
import { NotificationsService } from '../notifications/notifications.service';
import { handleNotFoundError, handleDatabaseError, handleValidationError } from 'src/shared/utils/errors.utils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly paginationService: PaginationService,
    private readonly notificationsService: NotificationsService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { id: createUserDto.id },
      });
      if (existingUser) handleValidationError('id', { dto: createUserDto }, this.logger);
      const newUser = this.usersRepository.create(createUserDto);
      this.notificationsService.notifyUser(newUser);
      return this.usersRepository.save(newUser);
    } catch (error) {
      handleDatabaseError(
        error,
        'Error creating user',
        { dto: createUserDto },
        this.logger,
      );
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const result = await this.paginationService.paginate(
      this.usersRepository,
      page || 1,
      limit || Number.MAX_SAFE_INTEGER,
      {
        order: { id: 'ASC' },
        relations: { role: true },
      },
    );
    return {
      data: result.data,
      meta: result.meta,
    };
  }

  async findOne(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: { role: true },
      });
      if (!user) handleNotFoundError('user', id, this.logger);
      return user;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error finding user',
        { id },
        this.logger,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { id },
      });
      if (existingUser && existingUser.id !== id) handleValidationError('id', { dto: updateUserDto }, this.logger);
      await this.usersRepository.update(id, updateUserDto);
      const updatedUser = await this.usersRepository.findOne({
        where: { id },
        relations: { role: true },
      });
      if (!updatedUser) handleNotFoundError('user', id, this.logger);
      this.notificationsService.notifyUser(updatedUser);
      return updatedUser;
    } catch (error) {
      handleDatabaseError(
        error,
        'Error updating user',
        { id, dto: updateUserDto },
        this.logger,
      );
    }
  }

  async remove(id: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (!existingUser || existingUser.id !== id) handleNotFoundError('user', id, this.logger);
    await this.usersRepository.delete(id);
    this.notificationsService.notifyUser(existingUser);
  }
}