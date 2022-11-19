import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('user already exist');
    }
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const options: QueryOptions = { new: true, upsert: true };
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, options)
      .select('-__v'); // ommit the __v field
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndRemove(id);
    if (!user) {
      throw new NotFoundException(`team not found ${id}`);
    }
    return user;
  }
}
