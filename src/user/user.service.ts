
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
  private users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
    {
      userId: 3,
      username: 'minjae',
      password: 'password'
    }
  ];

  async register(userName: string, password: string): Promise<User | undefined> {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    this.users.push({userId: this.users.length + 1, username: userName, password: hashedPassword})
    return this.users[this.users.length-1]
  }

  async login(username: string, password: string): Promise<boolean | undefined> {
    console.log('hohoho')
    const user = await this.findOne(username)
    console.log(user)
    if(!user) return false
    return await bcrypt.compare(user.password, password)
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(v => v.username === username);
  }
}
