import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User): Promise<User> {
    const userCreated = new this.userModel(user);

    return userCreated.save();
  }

  async listAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findOne(userInfo: string | undefined): Promise<any> {
    const user = this.userModel.find({
      email: userInfo,
      $or: [{ phone: userInfo }],
    });

    return user;
  }

  async update(id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user).exec();
  }

  async remove(id: string) {
    const userRemoved = this.userModel.findByIdAndDelete({ _id: id }).exec();
    console.log(userRemoved);
  }
}
