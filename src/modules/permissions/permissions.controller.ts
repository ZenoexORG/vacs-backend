import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({ summary: 'Create a permission' })
  @ApiBody({ type: CreatePermissionDto })
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:permissions')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @ApiOperation({ summary: 'Get all permissions' })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    default: 1,
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:permissions')
  findAll(@Query() paginationDto) {
    return this.permissionsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a permission by id' })
  @ApiParam({
    name: 'id',
    description: 'Permission unique id',
    example: 1,
    type: Number,
  })
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:permissions')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a permission' })
  @ApiParam({
    name: 'id',
    description: 'Permission unique id',
    example: 1,
    type: Number,
  })
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('update:permissions')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @ApiOperation({ summary: 'Delete a permission' })
  @ApiParam({
    name: 'id',
    description: 'Permission unique id',
    example: 1,
    type: Number,
  })
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete:permissions')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
