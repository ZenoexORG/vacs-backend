import { PartialType } from '@nestjs/swagger';
import { CreateVehicleClassDto } from './create-vehicle-class.dto';

export class UpdateVehicleClassDto extends PartialType(CreateVehicleClassDto) {}