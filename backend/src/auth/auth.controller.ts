import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

class LoginDto {
  email: string;
  password: string;
}

class SignupDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(signupDto.email);
    if (existingUser) {
      // User exists, attempt login instead
      return this.authService.login(signupDto.email, signupDto.password);
    }
    
    // Create new user
    const user = await this.usersService.createPublic(signupDto);
    return this.authService.login(signupDto.email, signupDto.password);
  }
}