export class CreateUserDto {
  login: string;
  password: string;
  email: string;
}

export class FilterParamsDto {
  pageNumber: number;
  sortBy: string;
  sortDirection?: SortDirectionEnum;
  pageSize: number;
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
}

export enum SortDirectionEnum {
  desc = 'desc',
  asc = 'asc',
}
