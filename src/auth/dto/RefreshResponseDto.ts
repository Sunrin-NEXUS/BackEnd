import { ApiProperty } from '@nestjs/swagger'

export class AccessTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'success' })
  status: string

  @ApiProperty({ example: 'Access token has been refreshed successfully.' })
  message: string

  @ApiProperty({ type: () => AccessTokenDto })
  data: AccessTokenDto
}
