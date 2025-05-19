import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenBlacklistService } from "./token-blacklist.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tokenBlacklist: TokenBlacklistService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'supersecreto',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (this.tokenBlacklist.has(token)) {
      throw new UnauthorizedException('Token revocado');
    }

    return { userId: payload.sub };
  }
}