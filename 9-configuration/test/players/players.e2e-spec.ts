import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PlayersModule } from '../../src/players/players.module';
import { CreatePlayerDto } from '../../src/players/dto/create-player.dto'
import { PrismaService } from '../../src/prisma/prisma.service';


const mockPlayer = {
    id: '1',
    firstName: 'first Mock',
    lastName: 'last Mock',
    ppg: 23,
    createdAt: "2022-09-30T15:21:22.412Z",
    updatedAt: "2022-09-30T15:21:22.413Z",
    agentId: null,
    teamId: null
}
const mockPlayerDB = [mockPlayer];

const mockPrismaService = {
    player: {
        findMany: jest.fn(()=>{
            return mockPlayerDB;
        }),
        findUnique: jest.fn(()=>{
            return mockPlayer;
        }),
        create: jest.fn().mockImplementation(() => {
            return mockPlayer;
        }),
        update: jest.fn().mockImplementation(() => {
            return mockPlayer;
        }),
        delete: jest.fn(()=>{
            return mockPlayer;
        }),
    }
}

describe('[Feature] Players -/players', () => {
    const player: CreatePlayerDto = {
        firstName: 'first Mock',
        lastName: 'last Mock',
        ppg: 23
    }
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PlayersModule]
        })
        .overrideProvider(PrismaService)
        .useValue(mockPrismaService)
        .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }),
        )
        await app.init();
    });

    it('Get All [GET /]', () => {
        return request(app.getHttpServer()).get('/players').expect(HttpStatus.OK);
    })
    
    it('Get one [GET /:id]' , ()=>{
        return request(app.getHttpServer()).get('/players/1').expect(HttpStatus.OK);
    })

    it('Create [POST /]', () => {
        return request(app.getHttpServer()).post('/players').send(player).expect(HttpStatus.CREATED).then(({ body })=>{
           expect(body).toEqual(mockPlayer)
        })
    });

    it('Update one [PATCH /:id]', ()=>{
        return request(app.getHttpServer()).put('/players/1').expect(HttpStatus.OK);
    })

    it('Delete one [DELETE /:id]', ()=>{
        return request(app.getHttpServer()).delete('/players/1').expect(HttpStatus.OK);
    })
    afterAll(async () => {
        await app.close()
    });
});
