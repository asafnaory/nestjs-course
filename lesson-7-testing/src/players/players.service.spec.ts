import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PlayersService } from './players.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Player } from '@prisma/client';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

const createMockService = (): DeepPartial<PrismaService> => ({
  player: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});

const mockPlayer: Player = {
  id: '1',
  firstName: 'first Mock',
  lastName: 'last Mock',
  ppg: 23,
  createdAt: new Date('2022-09-30T15:21:22.412Z'),
  updatedAt: new Date('2022-09-30T15:21:22.413Z'),
  teamId: '123',
};

describe('PlayersService', () => {
  let service: PlayersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: PrismaService, useValue: createMockService() },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getPlayers', () => {});
  describe('getPlayer by id', () => {});
  describe('createPlayer by id', () => {});
  describe('updatePlayer', () => {
    it('should throw an exception when player was not found', async () => {
      // Arrange
      prisma.player.update = jest.fn().mockRejectedValueOnce('Mock Error');
      try {
        // Act
        await service.updatePlayer('1', {
          firstName: 'mock',
          lastName: 'mock',
          ppg: 1,
        });
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Mock Error');
      }
    });

    it('should return player, when player was found', async () => {
      // Arrange
      const playerUpdateSpy = jest
        .spyOn(prisma.player, 'update')
        .mockReturnValueOnce(mockPlayer as any);

      // Act
      const updatedPlayer = await service.updatePlayer('1', {
        firstName: 'mock',
        lastName: 'mock',
        ppg: 1,
      });

      // Assert
      expect(playerUpdateSpy).toBeCalledTimes(1);
      expect(updatedPlayer).toEqual({
        firstName: 'first Mock',
        id: '1',
        lastName: 'last Mock',
        ppg: 23,
      });
    });
  });
  describe('delete Player by id', () => {});
});
