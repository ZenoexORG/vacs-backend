import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Crear un usuario' })
    @ApiBody({ type: CreateUserDto })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Listar usuarios' })
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiOperation({ summary: 'Buscar un usuario por id' })
    @ApiParam({ name: 'id', description: 'Id único del usuario', example: 1})
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiParam({ name: 'id', description: 'Id único del usuario', example: 1})
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiParam({ name: 'id', description: 'Id único del usuario', example: 1})
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}