import { Controller, Post, Body, Patch, Get, UseGuards, Request, ConflictException, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { diskStorage } from 'multer';
import { extname } from 'path';

class LoginDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(6)
  password: string;
}

class SignupDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(6)
  password: string;
  
  @IsString()
  firstName: string;
  
  @IsString()
  lastName: string;
}

class UpdateProfileDto {
  @IsString()
  firstName: string;
  
  @IsString()
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
    // Validate required fields
    if (!signupDto.email || !signupDto.password || !signupDto.firstName || !signupDto.lastName) {
      throw new BadRequestException('All fields are required: email, password, firstName, lastName');
    }

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(signupDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists. Please use login instead.');
    }
    
    try {
      // Create new user
      const user = await this.usersService.createPublic(signupDto);
      return this.authService.login(signupDto.email, signupDto.password);
    } catch (error) {
      throw new BadRequestException('Failed to create user. Please try again.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-organization')
  async updateOrganization(@Request() req, @Body() body: { organizationId: string }) {
    const updatedUser = await this.usersService.updateUserOrganization(req.user.userId, body.organizationId);
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.sub, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `avatar-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return this.authService.updateAvatar(req.user.sub, avatarUrl);
  }
}