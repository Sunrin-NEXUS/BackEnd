import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Patch, Request, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { ChangeEmailDto } from './dto/ChangeEmailDto';
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserResponseDto } from "./dto/UserResponseDto";
import { AccessGuard } from "src/auth/guard/access.guard";
import { ChangePasswordDto } from "./dto/ChangePasswordDto";
import { Request as expReq } from "express";
import { User } from '@prisma/client';

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
}