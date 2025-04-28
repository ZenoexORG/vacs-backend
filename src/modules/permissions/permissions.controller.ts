import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,  
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,  
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Auth } from 'src/shared/decorators/permissions.decorator';
import { AppPermissions } from 'src/shared/enums/permissions.enum';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({ summary: 'Create a permission' })
  @ApiBody({ type: CreatePermissionDto })    
  @Auth(AppPermissions.PERMISSIONS_CREATE)
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
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
  @Auth(AppPermissions.PERMISSIONS_VIEW)
  @Get()
  async findAll(@Query() paginationDto) {
    return this.permissionsService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get a permission by id' })
  @ApiParam({
    name: 'id',
    description: 'Permission unique id',
    example: 1,
    type: Number,
  })    
  @Auth(AppPermissions.PERMISSIONS_VIEW)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a permission' })
  @ApiParam({
    name: 'id',
    description: 'Permission unique id',
    example: 1,
    type: Number,
  })    
  @Auth(AppPermissions.PERMISSIONS_EDIT)
  @Patch(':id')
  async update(
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
  @Auth(AppPermissions.PERMISSIONS_DELETE)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
