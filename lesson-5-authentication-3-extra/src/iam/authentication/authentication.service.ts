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
    async signin(dto: AuthCredentialsDto): Promise<{ accessToken: string, refreshToken: string }> {
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
            return this.generateTokens(user)
        } catch (e: unknown) {
            handleErrors(e);
        }
    }
    async refreshTokens(id: string) {
        try {        
          const user = await this.prisma.user.findUnique({
              where: {
                id,
            }
          });
          return await this.generateTokens(user);
        } catch (err) {
          throw new UnauthorizedException();
        }
      }

      async generateTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.allSettled([
            this.signToken<Partial<User>>(user.id, jwtConstants.JWT_SECRET,Number(jwtConstants.JWT_ACCESS_TOKEN_TTL), {id: user.id}),
            this.signToken<Partial<User>>(user.id, jwtConstants.REFRESH_JWT_SECRET, Number(jwtConstants.JWT_REFRESH_TOKEN_TTL), { id: user.id }),
        ]);
        if(accessToken.status === 'rejected' || refreshToken.status === 'rejected') throw new Error('Error signing tokens');
        return { accessToken: accessToken.value, refreshToken: refreshToken.value };
      }

      async removeUserRefreshToken(id: string): Promise<User> {
        return await this.prisma.user.update({
          where: { id },
          data: {
            refreshToken: null,
          },
        });
      }

      getSignOutCookies(): string[] {
        return [
          'accessToken=; HttpOnly; Path=/; Max-Age=0 SameSite=Strict',
          'refreshToken=; HttpOnly; Path=/; Max-Age=0 SameSite=Strict',
        ];
      }

    private async signToken<T extends object>(userId: string,secret: string, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
          {
            ...payload,
          },
          {
            audience: jwtConstants.JWT_TOKEN_AUDIENCE,
            issuer: jwtConstants.JWT_TOKEN_ISSUER,
            secret,
            expiresIn: expiresIn,
          },
        );
      }
}
