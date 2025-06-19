import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ChangeEmailDto } from "./dto/ChangeEmailDto";
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from "@nestjs/common";
import { UserResponseDto } from "./dto/UserResponseDto";
import { ChangePasswordDto } from "./dto/ChangePasswordDto";
import * as bcrypt from 'bcrypt'
import { Company, User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async changeEmail({originalEmail, newEmail}: ChangeEmailDto): Promise<UserResponseDto>{
        if(originalEmail === newEmail)
          throw new BadRequestException({message: 'New email Must Not same as Original email'})

        const isVerified = !!(await this.prismaService.emailVerification.findUnique({where: {email: newEmail}}))?.isVerified
        if(!isVerified){
          throw new BadRequestException({message: "New email is Not Verified"})
        }

        const user = await this.prismaService.user.findUnique({where: {email: originalEmail}})
        if(!user){
          throw new BadRequestException({message: "Orginal email is Not found"}) 
        }

        const res = await this.prismaService.user.update({
          where: {email: originalEmail},
          data: {email: newEmail}
        })
        return {
          uuid: res.uuid,
          id: res.id,
          email: res.email
        }
    }

  async changePassord(
    {originalPassword, newPassword}: ChangePasswordDto,
    user: User
  ): Promise<UserResponseDto>{
    console.log(user)
    const isCorrectPassword = await bcrypt.compare(originalPassword, user.password)
    if(!isCorrectPassword)
      throw new UnauthorizedException({message: "Password is Not Correct"})
    if(originalPassword === newPassword)
      throw new BadRequestException({message: "New password Must Not same as Orginal password"})

    
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const newUser = await this.prismaService.user.update({
      where: {uuid: user.uuid},
      data: {
        password: hashedPassword
      }
    })

    return {
      uuid: newUser.uuid,
      id: newUser.id,
      email: newUser.email,
    }
  }   

  async subscribe(user: User, company: Company) {
    const founduser = await this.prismaService.user.findUnique({
      where: {uuid: user.uuid},
      include: {subscribes: true},
    })

    const isAlreadySubscribed = founduser?.subscribes.some(
      (subscribedCompany) => subscribedCompany.uuid === company.uuid
    )

    if(isAlreadySubscribed){
      throw new BadRequestException({message: 'This Company is Already Subscribed'})
    }
    
    await this.prismaService.user.update({
      where: {uuid: user.uuid},
      data: {
        subscribes: {
          connect: {uuid: company.uuid},
        },
      },
    })

    return {message: 'Subscribe is Completed'}
  }

  async getCompanyByNameOrThrow(companyName: string): Promise<Company> {
    const company = await this.prismaService.company.findUnique({
      where: {name: companyName},
    })

    if(!company) {
      throw new BadRequestException({message: 'The Company is not existed'})
    }

    return company;
  }

  async unsubscribe(user: User, company: Company):Promise<{message: string}> {
    const founduser = await this.prismaService.user.findUnique({
      where: {uuid: user.uuid},
      include: {subscribes: true},
    })

    const isSubscribed = founduser?.subscribes.some(
      (subscribedCompany) => subscribedCompany.uuid === company.uuid
    )

    if(!isSubscribed) {
      throw new BadRequestException({message: 'You Must Subscribe'})
    }

    await this.prismaService.user.update({
      where: {uuid: user.uuid},
      data: {
        subscribes: {
          disconnect: {uuid: company.uuid}
        }
      }
    })
    return {message: 'Successfully Canceled Subscribe'}
  }
}