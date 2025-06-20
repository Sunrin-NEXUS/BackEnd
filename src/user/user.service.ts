import { Injectable, UnauthorizedException } from '@nestjs/common';
import {CompanyService} from '../company/company.service'
import { ChangeEmailDto } from "./dto/ChangeEmailDto";
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from "@nestjs/common";
import {SubscribeCompanyDto} from './dto/SubscribeCompanyDto'
import {SubscribedCompaniesResponseDto} from './dto/SubscribedCompaniesResponseDto'
import { UserResponseDto } from "./dto/UserResponseDto";
import { ChangePasswordDto } from "./dto/ChangePasswordDto";
import * as bcrypt from 'bcrypt'
import { User } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
      private readonly prismaService: PrismaService,
      private readonly companyService: CompanyService
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

  async subscribe(userUuid: string, {companyName}: SubscribeCompanyDto) {
    const user = await this.prismaService.user.findUnique({
      where: {uuid: userUuid},
      include: {subscribes: true},
    })

    if(!user)
      throw new UnauthorizedException({message: "User does not exist"})

    // company 가져오는건 companyService의 책임임
    const {uuid: companyUuid} = await this.companyService.getCompanyByName(companyName)

    const isAlreadySubscribed = user.subscribes.some(
      (subscribedCompany) =>
        subscribedCompany.uuid === companyUuid
    )

    if(isAlreadySubscribed)
      throw new BadRequestException({message: 'Already Subscribed'})

    await this.prismaService.user.update({
      where: {uuid: user.uuid},
      data: {
        subscribes: {
          connect: {uuid: companyUuid},
        },
      },
    })

    return {message: 'Subscribe is Completed'}
  }

  async unsubscribe(userUuid: string, {companyName}: SubscribeCompanyDto):Promise<{message: string}> {
    const user = await this.prismaService.user.findUnique({
      where: {uuid: userUuid},
      include: {subscribes: true},
    })

    if(!user)
      throw new UnauthorizedException({message: "User does not exist"})

    const {uuid: companyUuid} = await this.companyService.getCompanyByName(companyName)

    const isSubscribed = user?.subscribes.some(
      (subscribedCompany) =>
        subscribedCompany.uuid === companyUuid
    )

    if(!isSubscribed)
      throw new BadRequestException({message: 'You Must Subscribe'})

    await this.prismaService.user.update({
      where: {uuid: user.uuid},
      data: {
        subscribes: {
          disconnect: {uuid: companyUuid}
        }
      }
    })
    return {message: 'Successfully Canceled Subscribe'}
  }

  async deleteAccount(user: User): Promise<{message: string}> {
    const foundUser = await this.prismaService.user.findUnique({
      where: {uuid: user.uuid}
    })

    if(!foundUser) {
      throw new BadRequestException({message: 'This user does Not existed'})
    }

    await this.prismaService.user.delete({
      where: {uuid: user.uuid}
    })
    return {message: 'Successfully Deleted Account'}
  }

  async getSubscribedCompanies(user: User): Promise<SubscribedCompaniesResponseDto> {
    const foundUser = await this.prismaService.user.findUnique({
      where: {uuid : user.uuid},
      include: {
        subscribes: {
          select: {
            uuid: true,
            name: true,
            description: true,
            profileImageUrl: true
          }
        }
      }
    })

    if(!foundUser) {
      throw new BadRequestException({message: 'This user does Not existed'})
    }

    return {
      items: foundUser.subscribes.map(v => ({
        uuid: v.uuid,
        name: v.name,
        description: v.description,
        profileImageUrl: v.profileImageUrl,
      }))
    }
  }
}