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

  async signIn(emailOrPhone: string, userPass: string): Promise<any> {
    console.log(
      '🚀 ~ file: auth.service.ts:18 ~ AuthService ~ signIn ~ emailOrPhone:',
      emailOrPhone,
    );
    const user = await this.usersService.findOne(emailOrPhone);
    console.log('USER ::: ', user);

    if (!user) {
      throw new NotAcceptableException();
    }
    const validPassword = await compare(userPass, user.password);

    if (!validPassword) {
      throw new UnauthorizedException();
    }
    const { password, ...payload } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
