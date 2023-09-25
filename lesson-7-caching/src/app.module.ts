import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { TeamsModule } from './teams/teams.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { IamModule } from './iam/iam.module';
import { AccessTokenGuard } from './iam/guards/access-token.guard';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
  PlayersModule, 
  TeamsModule, 
  IamModule, 
  JwtModule, 
  PrismaModule,
  CacheModule.register<RedisClientOptions>({
    // The time-to-live (TTL)
    ttl: 5,
    // The cache store to use
    store: redisStore,
    // The hostname or IP address of the Redis server.
    host: 'localhost',
    // The port number of the Redis serve
    port: 6379,
    // Available globally in all modules
    isGlobal: true
  }),
],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
