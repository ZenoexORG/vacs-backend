import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ){}

  async create(createRoleDto: CreateRoleDto): Promise<Role>{
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  async findAll(){
    return this.rolesRepository.find({relations: ['users', 'employees', 'permissions']});
  }

  async findOne(id: number){
    return this.rolesRepository.findOne({where: {id}, relations: ['users', 'employees', 'permissions']});
  }

  async update(id: number, updateRoleDto: UpdateRoleDto){
    return this.rolesRepository.update(id, updateRoleDto);
  }

  async remove(id: number){
    return this.rolesRepository.delete(id);
  }
}