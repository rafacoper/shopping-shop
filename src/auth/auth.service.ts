import {
  Injectable,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compare } from './encrypter';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(input): Promise<any> {
    const inputed = input.email
      ? { email: input.email }
      : { phone: input.phone };
    const user = await this.usersService.findOne(inputed);

    if (!user) {
      throw new NotAcceptableException();
    }
    const validPassword = await compare(input.password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException();
    }
    const { password, ...payload } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
