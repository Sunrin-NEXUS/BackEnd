import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const pagination = new PaginationDto();
    pagination.page = query.page ? parseInt(query.page) : 1;
    pagination.limit = query.limit ? parseInt(query.limit) : 10;

    return pagination;
  },
); 