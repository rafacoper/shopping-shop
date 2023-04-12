import { Injectable } from '@nestjs/common';
import { User } from './user/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { encrypt } from 'src/auth/encrypter';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(user: User): Promise<any> {
    const userCreated = new this.userModel();
    (userCreated.name = user.name),
      (userCreated.email = user.email),
      (userCreated.phone = user.phone),
      (userCreated.password = await encrypt(user.password));

    await userCreated.save();
  }

  async listAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findOne(input: any): Promise<User> {
    const inputedInfo = input.email ? input.email : input.phone;
    return this.userModel.findOne({
      $or: [{ email: inputedInfo }, { phone: inputedInfo }],
    });
  }

  async update(id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user).exec();
  }

  async remove(id: string) {
    const userRemoved = this.userModel.findByIdAndDelete({ _id: id }).exec();
    console.log(userRemoved);
  }
}
