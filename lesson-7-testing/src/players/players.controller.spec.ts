import { NotFoundException } from '@nestjs/common/exceptions';
import { Test, TestingModule } from '@nestjs/testing';
import { Player } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PrismaModule } from '../prisma/prisma.module';
import { CreatePlayerDto } from './dto/create-player.dto';
import { ResponsePlayerDto } from './dto/response-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

const pagination: Partial<PaginationQueryDto<Player>> = {};
const MockPlayer: Partial<ResponsePlayerDto> = {
  firstName: 'Mock firstName',
  lastName: 'Mock lastName',
};
const mockPlayerDto: UpdatePlayerDto = {
  firstName: 'mock',
};

describe('PlayerController', () => {
  let controller: PlayersController;
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [PlayersController],
      providers: [PlayersService],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPlayerById', () => {
    it('should return player if service return a valid player id', async () => {
      // Arrange
      const getPlayerByIdServiceSpy = jest
        .spyOn(service, 'getPlayerById')
        .mockResolvedValueOnce(MockPlayer as ResponsePlayerDto);
      // Act
      const players = await controller.getPlayerById('1');
      // Assert
      expect(getPlayerByIdServiceSpy).toHaveBeenCalledWith('1');
      expect(players).toEqual(MockPlayer);
    });
    it('should throw an error if service throws an error', async () => {
      // Arrange
      const getPlayerByIdServiceSpy = jest
        .spyOn(service, 'getPlayerById')
        .mockRejectedValueOnce(new NotFoundException(`Mock Error`));
      try {
        // Act
        await controller.getPlayerById('1');
      } catch (e) {
        // Assert
        expect(getPlayerByIdServiceSpy).toHaveBeenCalledWith('1');
        expect(e.message).toEqual('Mock Error');
      }
    });
  });
  describe('createPlayer', () => {
    it('should return ResponsePlayerDto when player is created properly', async () => {
      // Arrange
      const createPlayerSpy = jest
        .spyOn(service, 'createPlayer')
        .mockResolvedValueOnce(MockPlayer as ResponsePlayerDto);

      // Act
      const player = await controller.createPlayer(
        mockPlayerDto as CreatePlayerDto,
      );
      // Assert
      expect(createPlayerSpy).toHaveBeenCalledWith(mockPlayerDto);
      expect(player).toEqual(MockPlayer);
    });
  });
});
