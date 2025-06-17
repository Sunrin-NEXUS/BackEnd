import { Body, Controller, HttpCode, HttpStatus, Patch, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { ChangeEmailDto } from './dto/ChangeEmailDto';
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserResponseDto } from "./dto/UserResponseDto";
import { AccessGuard } from "src/auth/guard/access.guard";

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
        @Body() changeEmailDto: ChangeEmailDto 
    ): Promise<UserResponseDto> {
        return await this.userService.changeEmail(changeEmailDto)
    }


}