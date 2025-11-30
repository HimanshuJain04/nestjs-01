import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';

type User = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};

const USERS: User[] = [];

@Injectable()
export class UserService {
  checkEmailExist(email: string) {
    return USERS.some((user) => user.email === email);
  }

  createUser(userData: RegisterUserDto) {
    USERS.push(userData);

    return userData;
  }
}
