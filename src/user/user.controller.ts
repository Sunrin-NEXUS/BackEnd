import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Patch, Request, UseGuards, Delete } from "@nestjs/common";
import { UserService } from './user.service';
import { ChangeEmailDto } from './dto/ChangeEmailDto';
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserResponseDto } from "./dto/UserResponseDto";
import { AccessGuard } from "src/auth/guard/access.guard";
import { ChangePasswordDto } from "./dto/ChangePasswordDto";
import { Request as expReq } from "express";
import { User } from '@prisma/client';
import { SubscribeCompanyDto } from "./dto/SubscribeCompanyDto";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @UseGuards(AccessGuard)
    @ApiOperation({summary: '이메일 변경'})
    @ApiResponse({status: 201, description: '이메일 변경 성공'})
    @HttpCode(HttpStatus.CREATED)
    @Patch('change/email')
    async changeEmail(
        @Body() changeEmailDto: ChangeEmailDto,
    ): Promise<UserResponseDto> {
        return await this.userService.changeEmail(changeEmailDto)
    }

    @UseGuards(AccessGuard)
    @ApiOperation({summary: '비밀번호 변경'})
    @ApiResponse({status: 201, description: '비밀번호 변경 성공'})
    @HttpCode(HttpStatus.CREATED)
    @Patch('change/password')
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
        @Request() req: expReq
    ): Promise<UserResponseDto> {
        const user = req?.user
        if(!user)
            throw new InternalServerErrorException('Can Not Find User')

        return await this.userService.changePassord(changePasswordDto, user as User)
    }

    @UseGuards(AccessGuard)
    @ApiOperation({summary: '구독'})
    @ApiResponse({status: 201, description: '구독 성공'})
    @HttpCode(HttpStatus.CREATED)
    @Patch('subscribe')
    async subscribe(
        @Body() subscribeDto: SubscribeCompanyDto,
        @Request() req: expReq
    ): Promise<{message: string}> {
        // 언론사 가져오는 작업은 Controller의 책임이 아니라 생각함
        return await this.userService.subscribe(
          (req?.user as User).uuid,
          subscribeDto
        );
    }

    @UseGuards(AccessGuard)
    @ApiOperation({summary: '구독 해제'})
    @ApiResponse({status: 201, description: '구독 해제 성공'})
    @HttpCode(HttpStatus.CREATED)
    @Patch('unsubscribe')
    async unsubscribeCompany(
        @Body() subscribeCompanyDto: SubscribeCompanyDto,
        @Request() req: expReq
    ): Promise<{message: string}> {
        return await this.userService.unsubscribe(
          (req?.user as User).uuid,
          subscribeCompanyDto
        )
    }

    @UseGuards(AccessGuard)
    @ApiOperation({summary: '계정 삭제'})
    @ApiResponse({status: 201, description: '계정 삭제 성공'})
    @HttpCode(HttpStatus.CREATED)
    @Delete('delete')
    async deleteAccount(@Request() req: expReq): Promise<{message: string}> {
        const user = req?.user
        if (!user)
            throw new InternalServerErrorException('Can Not Find User')

        return await this.userService.deleteAccount(user as User)
    }
}