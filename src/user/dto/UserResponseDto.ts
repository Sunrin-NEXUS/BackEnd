import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        type: String,
        description: '사용자 UUID',
        example: '9ff59bfe-ba34-4d3b-a9a1-c3e3d81c3bb1',
        default: '9ff59bfe-ba34-4d3b-a9a1-c3e3d81c3bb1',
    })
    uuid: string;

    @ApiProperty({
        type: String,
        description: '사용자 ID (닉네임 또는 사용자명)',
        example: 'sunrin_student01',
    })
    id: string;

    @ApiProperty({
        type: String,
        description: '사용자 이메일 주소',
        example: 'student01@sunrint.hs.kr',
    })
    email: string;
}
