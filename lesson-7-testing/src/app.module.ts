import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth/auth.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [PlayersModule, TeamsModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      // useClass: AuthGuard(),
      useExisting: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AuthGuard
  ],
})
export class AppModule {}
