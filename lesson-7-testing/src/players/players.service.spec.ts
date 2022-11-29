import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PlayersService } from './players.service';
import { NotFoundException } from '@nestjs/common';
import { Player } from '@prisma/client';

const mockPlayer: Player = {
  id: '1',
  firstName: 'first Mock',
  lastName: 'last Mock',
  ppg: 23,
  createdAt: new Date("2022-09-30T15:21:22.412Z"),
  updatedAt: new Date("2022-09-30T15:21:22.413Z"),
  agentId: null,
  teamId: null
}

describe('PlayersService', () => {
  let service: PlayersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        PrismaService
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    prisma = module.get<PrismaService>(PrismaService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getPlayers', ()=>{});
  describe('getPlayer by id', ()=>{});
  describe('createPlayer by id', ()=>{});
  describe('updatePlayer', ()=>{
    it('should throw an exception when player was not found', async ()=>{
      // Arrange 
      prisma.player.findUnique = jest.fn().mockReturnValueOnce(null);
      try {
        // Act
        await service.updatePlayer('1', {firstName: 'mock', lastName:'mock', ppg: 1});
      }
      catch(error){
        // Assert
        expect(error).toBeInstanceOf(NotFoundException)
        expect(error.message).toEqual('Player with player id 1 does not exist');
      }
    })

    it('should return player, when player was found', async ()=>{
      // Arrange 
      prisma.player.findUnique = jest.fn().mockReturnValueOnce(mockPlayer as any);
      const playerFindUniqueSpy = jest.spyOn(prisma.player, 'update').mockReturnValueOnce(mockPlayer as any);
      
      // Act 
      await service.updatePlayer('1', {firstName: 'mock', lastName:'mock', ppg: 1});

      // Assert
      expect(playerFindUniqueSpy).toBeCalledTimes(1);
    })
  });
  describe('delete Player by id', ()=>{});
});
