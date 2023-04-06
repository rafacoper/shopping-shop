import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(emailOrPhone: any, pass: any) {
    const user = await this.usersService.findOne(emailOrPhone);

    const passwordValid = await bcrypt.compare(pass, user.password);

    if (user && passwordValid) {
      const { password, ...payload } = user;

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    return null;
  }
}
