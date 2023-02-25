import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import playersConfig from './config/players.config';

@Module({
  imports: [
    ConfigModule.forFeature(playersConfig), 
    PrismaModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
