import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ConvertDates } from 'src/shared/decorators/date-conversion.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Create an user' })
  @ApiBody({ type: CreateUserDto })
  @Auth(AppPermissions.USERS_CREATE)
  @Post()
  @ConvertDates(['created_at'])
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'limit', description: 'Number of items per page', required: false, default: 10 })
  @ApiQuery({ name: 'page', description: 'Page number', required: false, default: 1, })
  @Auth(AppPermissions.USERS_VIEW)
  @Get()
  @ConvertDates(['created_at'])
  async findAll(@Query() paginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get an user by id' })
  @ApiParam({ name: 'id', description: 'User unique id', example: 1 })
  @Get(':id')
  @Auth(AppPermissions.USERS_VIEW)
  @ConvertDates(['created_at'])
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an user' })
  @ApiParam({ name: 'id', description: 'User unique id', example: 1 })
  @Patch(':id')
  @Auth(AppPermissions.USERS_EDIT)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete an user' })
  @ApiParam({ name: 'id', description: 'User unique id', example: 1 })
  @Delete(':id')
  @Auth(AppPermissions.USERS_DELETE)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}