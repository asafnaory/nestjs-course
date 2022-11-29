import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';
import { Model, QueryOptions } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Team } from '../teams/entities/team.entity';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { NotFoundException } from '@nestjs/common';

const mockPlayer: Partial<Player> = {
  firstName: 'first Mock',
  lastName: 'last Mock',
  ppg: '23',
};
const mockPlayerDto: Partial<UpdatePlayerDto> = {
  firstName: 'first Mock',
  lastName: 'last Mock',
};

describe('PlayersService', () => {
  let mockPlayerModel: Model<Player>;
  let mockTeamModel: Model<Team>;
  let service: PlayersService;
  const options: QueryOptions = { new: true, upsert: true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getModelToken(Player.name),
          useValue: Model,
        },
        {
          provide: getModelToken(Team.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    mockPlayerModel = module.get<Model<Player>>(getModelToken(Player.name));
    mockTeamModel = module.get<Model<Team>>(getModelToken(Team.name));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getPlayers', () => {});
  describe('getPlayer by id', () => {
    it('should call findById with correct id', async () => {
      // Arrange
      const findByIdSpy = jest
        .spyOn(mockPlayerModel, 'findById')
        .mockResolvedValueOnce(mockPlayer);
      // Act
      const player = await service.getPlayerById('123');
      // Assert
      expect(findByIdSpy).toHaveBeenCalledWith('123');
      expect(player).toEqual(mockPlayer);
    });
    it('should throw an exception when player was not found', async () => {
      // Arrange
      const findByIdSpy = jest
        .spyOn(mockPlayerModel, 'findById')
        .mockResolvedValueOnce(null);
      try {
        // Act
        await service.getPlayerById('123');
      } catch (e) {
        // Assert
        expect(findByIdSpy).toHaveBeenCalledWith('123');
        expect(e).toEqual(new NotFoundException(`Player not found id:'123'`));
      }
    });
  });
  describe('createPlayer by id', () => {});
  describe('updatePlayer', () => {
    it('should return updated player, when player was found', async () => {
      // Arrange
      const findByIdAndUpdateSpy = jest
        .spyOn(mockPlayerModel, 'findByIdAndUpdate')
        .mockImplementationOnce(
          () =>
            ({ select: jest.fn().mockResolvedValueOnce(mockPlayer) } as any),
        );
      // Act
      const updatedPlayer = await service.updatePlayer('123', mockPlayerDto);
      // Assert
      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
        '123',
        mockPlayerDto,
        options,
      );
      expect(updatedPlayer).toEqual(mockPlayer);
    });
  });
  describe('delete Player by id', () => {});
});
