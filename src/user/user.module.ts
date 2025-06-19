import { Module } from "@nestjs/common";
import {CompanyService} from '../company/company.service'
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    controllers: [UserController],
    providers: [UserService, CompanyService],
})
export class UserModule {}