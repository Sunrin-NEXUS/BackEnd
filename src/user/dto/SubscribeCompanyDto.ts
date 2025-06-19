import { IsString } from "class-validator";
import {ApiProperty} from '@nestjs/swagger'

export class SubscribeCompanyDto{
    @ApiProperty({
    type: String,
      description: 'CompanyName',
      example: 'SBS',
      default: 'SBS',
    })
    @IsString()
    companyName : string;
}