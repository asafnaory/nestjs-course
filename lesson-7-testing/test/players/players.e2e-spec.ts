import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PlayersModule } from '../../src/players/players.module';
import { CreatePlayerDto } from '../../src/players/dto/create-player.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthModule } from '../../src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../src/auth/guards/auth/auth.guard';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const MockAuthGuard = { canActivate: () => true };
const mockPlayer = {
  id: '1',
  firstName: 'first Mock',
  lastName: 'last Mock',
  ppg: 23,
  createdAt: '2022-09-30T15:21:22.412Z',
  updatedAt: '2022-09-30T15:21:22.413Z',
  userId: null,
  teamId: null,
};
const mockPlayerDB = [mockPlayer];
const authCredentialsDto: AuthCredentialsDto = {
  email: 'mockEmail@test.com',
  password: 'Aa123456#',
};
const mockUser: User = {
  email: 'mockEmail@test.com',
  password: 'Aa123456#',
  id: '1',
  role: Role.BASIC,
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(() => {
      return mockUser;
    }),
  },
  player: {
    findMany: jest.fn(() => {
      return mockPlayerDB;
    }),
    findUnique: jest.fn(() => {
      return mockPlayer;
    }),
    create: jest.fn().mockImplementation(() => {
      return mockPlayer;
    }),
    update: jest.fn().mockImplementation(() => {
      return mockPlayer;
    }),
    delete: jest.fn(() => {
      return mockPlayer;
    }),
  },
};

describe('[Feature] Players -/players', () => {
  let jwt;
  const player: CreatePlayerDto = {
    firstName: 'first Mock',
    lastName: 'last Mock',
    ppg: 23,
    teamId: '858dfb27-cddc-41c0-97f8-b81caea26af1',
  };
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlayersModule, AuthModule],
      controllers: [],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(AuthGuard)
      .useClass(MockAuthGuard)
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

    const bcryptCompare = jest.fn().mockResolvedValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const signinResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(authCredentialsDto)
      .expect(HttpStatus.CREATED);

    jwt = signinResponse.body.accessToken;
  });

  // it('should update user info', async () => {
  //   const loginRes = await request(app.getHttpServer())
  //     .post('/auth/signin')
  //     .send(mockLoginUser);

  it('Get All [GET /]', () => {
    return request(app.getHttpServer())
      .get('/players')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(HttpStatus.OK);
  });

  it('Get one [GET /:id]', () => {
    return request(app.getHttpServer())
      .get('/players/1')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(HttpStatus.OK);
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/players')
      .send(player)
      .set('Authorization', 'Bearer ' + jwt)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toEqual({
          id: mockPlayer.id,
          firstName: mockPlayer.firstName,
          lastName: mockPlayer.lastName,
          ppg: mockPlayer.ppg,
        });
      });
  });

  it('Update one [PATCH /:id]', () => {
    return request(app.getHttpServer())
      .put('/players/1')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual({
          id: mockPlayer.id,
          firstName: mockPlayer.firstName,
          lastName: mockPlayer.lastName,
          ppg: mockPlayer.ppg,
        });
      });
  });

  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete('/players/1')
      .set('Authorization', 'Bearer ' + jwt)
      .expect(HttpStatus.OK);
  });
  afterAll(async () => {
    await app.close();
  });
});
