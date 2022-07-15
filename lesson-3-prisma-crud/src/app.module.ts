import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PlayersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
