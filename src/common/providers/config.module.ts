import { ConfigValidator } from '@common';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';

const options: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
  validationSchema: ConfigValidator,
};

@Module({
  imports: [ConfigModule.forRoot(options)],
})
export class GlobalConfigModule {}
