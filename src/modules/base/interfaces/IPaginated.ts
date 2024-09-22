import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginatedResult } from 'prisma-pagination';

class Meta {
  @ApiResponseProperty()
  total: number;

  @ApiResponseProperty()
  lastPage: number;

  @ApiResponseProperty()
  currentPage: number;

  @ApiResponseProperty()
  perPage: number;

  @ApiResponseProperty()
  prev: number | null;

  @ApiResponseProperty()
  next: number | null;
}

export class Paginated<Dto = any> implements PaginatedResult<Dto> {
  @ApiResponseProperty()
  data: Array<Dto>;

  @ApiResponseProperty()
  meta: Meta;
}
