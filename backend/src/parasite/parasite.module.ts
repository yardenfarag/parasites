import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ParasiteController } from './parasite.controller';
import { ParasiteService } from './parasite.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 3600000, // 1 hour
      max: 1000, // Maximum number of items in cache
    }),
  ],
  controllers: [ParasiteController],
  providers: [ParasiteService],
  exports: [ParasiteService],
})
export class ParasiteModule {}
