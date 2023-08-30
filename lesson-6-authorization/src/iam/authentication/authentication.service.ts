import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { handleErrors } from 'src/helpers/helpers';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './consts';

@Injectable()
export class AuthenticationService {
    constructor(private prisma: PrismaService, private readonly hashingService: HashingService, private readonly jwtService: JwtService) { }
    async signup(dto: AuthCredentialsDto): Promise<User> {
        try {
            const { email, password } = dto;

            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (user) {
                // user already exists
                throw new ConflictException('User with that email already exists');
            }
            const hashedPassword = await this.hashingService.hash(password);

            const newAgent = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            return newAgent;
        } catch (e: unknown) {
            handleErrors(e);
        }
    }
    async signin(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        try {
            const { email, password } = dto;
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });

            //if no user found...
            if (!user) {
                throw new UnauthorizedException('Wrong credentials...');
            }

            // check if the password is valid
            const validPassword = await this.hashingService.compare(password, user.password);
            if (!validPassword) {
                throw new UnauthorizedException('Wrong credentials...');
            }

            const accessToken = await this.jwtService.signAsync(
                {
                    id: user.id,
                    email: user.email,
                },
                {
                    audience: jwtConstants.JWT_TOKEN_AUDIENCE,
                    issuer: jwtConstants.JWT_TOKEN_ISSUER,
                    secret: jwtConstants.JWT_SECRET,
                    expiresIn: Number(jwtConstants.JWT_ACCESS_TOKEN_TTL),
                },
            );
            return { accessToken }
        } catch (e: unknown) {
            handleErrors(e);
        }
    }
}
