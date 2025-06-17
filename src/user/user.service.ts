import { Injectable } from "@nestjs/common";
import { ChangeEmailDto } from "./dto/ChangeEmailDto";
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from "@nestjs/common";
import { UserResponseDto } from "./dto/UserResponseDto";


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
}