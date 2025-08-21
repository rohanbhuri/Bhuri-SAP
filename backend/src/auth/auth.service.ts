import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const payload = { 
      email: user.email, 
      sub: user._id.toString(), 
      organizationId: user.organizationId?.toString() || user.organizationIds[0]?.toString(),
      roles: roles.map(r => r.type)
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}