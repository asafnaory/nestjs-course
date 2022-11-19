import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constants';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { DbService } from '../db/db.service';
import { User } from './interfaces/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dbService: DbService) {
    // code for API server which needs to validate jwt token
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret, // public key for symmetric signature
    });
  }

  /**
   * For the jwt-strategy, Passport first verifies the JWT's signature and
   * decodes the JSON. It then invokes our validate() method passing the
   * decoded JSON as its single parameter. Based on the way JWT signing works,
   * we're guaranteed that we're receiving a valid token that we have previously
   * signed and issued to a valid user.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload; //<=== this is the id field saved in the payload of jwt itself!!
    console.log(`DEBUG validate: ${JSON.stringify(payload)}`);
    const userFromDb = await this.dbService.getUserById(id);

    if (!userFromDb) {
      throw new UnauthorizedException();
    }
    // return { ...userFromDb, 'extra-field-added-by-validation-from-strategy': 'ok' };
    return userFromDb;
  }
}
