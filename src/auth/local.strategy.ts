import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDto } from 'src/users/dto/user-signin.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(userLog: UserSignInDto) {
    const { email, phone, password } = userLog;

    const emailOrPhone = email ? email : phone;

    const user = await this.authService.validateUser(emailOrPhone, password);

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }

    return user;
  }
}
