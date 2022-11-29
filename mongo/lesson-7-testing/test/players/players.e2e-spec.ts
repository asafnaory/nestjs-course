import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PlayersModule } from '../../src/players/players.module';
import { CreatePlayerDto } from '../../src/players/dto/create-player.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Player } from '../../src/players/entities/player.entity';
import { Team } from '../../src/teams/entities/team.entity';
import { RolesGuard } from '../../src/auth/roles.guard';

const mockAlwaysPassGuard = { CanActivate: jest.fn(() => true) };
const mockPlayerDto: CreatePlayerDto = {
  firstName: 'first Mock',
  lastName: 'last Mock',
  ppg: '23',
  team: '637be2a58e9ec10c5ab43991',
};

const mockPlayer: Partial<Player> = {
  id: '1',
  firstName: 'first Mock',
  lastName: 'last Mock',
  ppg: '23',
};

const mockTeam: Partial<Team> = {
  id: '1',
  name: 'mock team',
  playersAmount: 14,
  players: [],
  save: jest.fn(),
};

const mockPlayerMongoModel = {
  find: jest.fn(() => {
    return {
      skip: jest.fn(() => {
        return {
          limit: jest.fn(() => [mockPlayer]),
        };
      }),
    };
  }),
  findById: jest.fn(() => {
    return mockPlayer;
  }),
  create: jest.fn().mockImplementation(() => {
    return mockPlayer;
  }),
  findByIdAndUpdate: jest.fn().mockImplementation(() => {
    return {
      select: jest.fn(() => mockTeam),
    };
  }),
  findByIdAndRemove: jest.fn(() => {
    return mockPlayer;
  }),
};
const mockTeamMongoModel = {
  find: jest.fn(() => {
    return [mockTeam];
  }),
  findById: jest.fn(() => {
    return mockTeam;
  }),
  create: jest.fn().mockImplementation(() => {
    return mockTeam;
  }),
  findByIdAndUpdate: jest.fn().mockImplementation(() => {
    return mockTeam;
  }),
  findByIdAndRemove: jest.fn(() => {
    return mockTeam;
  }),
};

describe('[Feature] Players -/players', () => {
  const player: Partial<CreatePlayerDto> = {
    firstName: 'first Mock',
    lastName: 'last Mock',
    ppg: '23',
  };
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlayersModule],
    })
      .overrideProvider(getModelToken(Player.name))
      .useValue(mockPlayerMongoModel)
      .overrideProvider(getModelToken(Team.name))
      .useValue(mockTeamMongoModel)
      .overrideGuard(RolesGuard)
      .useValue(mockAlwaysPassGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it('Get All players [GET /]', () => {
    return request(app.getHttpServer()).get('/players').expect(HttpStatus.OK);
  });

  it('Get one player [GET /:id]', () => {
    return request(app.getHttpServer())
      .get('/players/637be2a58e9ec10c5ab43991')
      .expect(HttpStatus.OK);
  });

  it('Create player [POST /]', () => {
    return request(app.getHttpServer())
      .post('/players')
      .send(mockPlayerDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toEqual(mockPlayer);
      });
  });

  it('Update one player [PATCH /:id]', () => {
    return request(app.getHttpServer())
      .put('/players/637be2a58e9ec10c5ab43991')
      .expect(HttpStatus.OK);
  });

  it('Delete one player [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete('/players/player/637be2a58e9ec10c5ab43991/team/637be2a58e9ec10c5ab43991')
      .expect(HttpStatus.OK);
  });
  afterAll(async () => {
    await app.close();
  });
});
