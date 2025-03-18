import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: { id: createUserDto.id } });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        return this.usersRepository.save(createUserDto);
    }

    async findAll(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        if (!page && !limit) {
            return this.usersRepository.find({ relations: {role: {permissions:true}} });
        }
        return this.getPaginatedUsers(page, limit);
    }

    private async getPaginatedUsers(page, limit) {
        const skippedItems = (page - 1) * limit;
        const [users, total] = await this.usersRepository.findAndCount({ skip: skippedItems, take: limit, relations: {role: {permissions:true}} });
        return {
            data: users,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / limit),
                per_page: limit,
            }
        }
    }

    async findOne(id: string) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: {role: {permissions:true}} });
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.usersRepository.update(id, updateUserDto);
    }

    async remove(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.usersRepository.remove
    }    
}
