import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserData: RegisterUserDto) {
    // check email already exist or not
    const isUserExist = this.userService.checkEmailExist(
      registerUserData.email,
    );

    if (isUserExist) {
      throw new ConflictException('User already exists with this email');
    }

    // hash the password
    const saltRound = 10;
    const hashedPass = await bcrypt.hash(registerUserData.password, saltRound);

    // create new user
    const newUser = this.userService.createUser({
      ...registerUserData,
      password: hashedPass as string,
    });

    // create jwt token
    const token = await this.jwtService.signAsync({
      email: newUser.email,
    });

    // return response with token
    return token;
  }
}
