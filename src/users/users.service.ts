import { Injectable } from '@nestjs/common';
import { User } from './user/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { encrypt } from 'src/auth/encrypter';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

  async findOne(input: string): Promise<User> {
    console.log('QUAL O INPUT', input);

    return this.userModel
      .findOne({
        $or: [{ email: input }, { phone: input }],
      })
      .exec();
  }

  // async findOne(email: string) {
  //   const allUsers = await this.userModel.find().exec();
  //   const rightUser = await allUsers.filter((us) => {
  //     us.email === email;
  //   });
  //   return rightUser;
  // }

  async update(id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user).exec();
  }

  async remove(id: string) {
    const userRemoved = this.userModel.findByIdAndDelete({ _id: id }).exec();
    console.log(userRemoved);
  }
}
