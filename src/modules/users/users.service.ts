import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}

    async create(createUserDto: CreateUserDto): Promise<User>{
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }

    async findAll(){
        return this.usersRepository.find({relations: ['role']});        
    }

    async findOne(id: number){
        return this.usersRepository.findOne({where: {id}, relations: ['role']});
    }

    async update(id: number, updateUserDto: UpdateUserDto){
        return this.usersRepository.update(id, updateUserDto);        
    }

    async remove(id: number){
        return this.usersRepository.delete(id);
    }
}