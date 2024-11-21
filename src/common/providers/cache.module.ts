import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

const options: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService) => ({
    ttl: configService.get('CACHE_TTL'),
    max: configService.get('CACHE_MAX'),
  }),
  inject: [ConfigService],
};

@Module({
  imports: [CacheModule.registerAsync(options)],
})
export class GlobalCacheModule {}
