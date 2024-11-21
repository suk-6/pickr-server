import importToArray from 'import-to-array';

import { Module } from '@nestjs/common';

import * as modules from '@modules';

import * as commonModules from '@common/modules';
import * as providers from '@common/providers';

@Module({
  imports: [
    ...importToArray(providers),
    ...importToArray(modules),
    ...importToArray(commonModules),
  ],
})
export class AppModule {}
