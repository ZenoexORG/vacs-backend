import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TimezoneService } from './services/timezone.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [TimezoneService],
    exports: [TimezoneService],
})
export class SharedModule { }