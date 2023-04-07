export class FilterParamsDto {
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirectionEnum;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
  searchNameTerm: string;
}

export class PaginationParams {
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirectionEnum;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
  searchNameTerm: string;
  skipItems: number;
  sortDirectionNumber: 1 | -1;
  constructor(private queryParams: FilterParamsDto) {
    this.pageNumber = queryParams.pageNumber ? queryParams.pageNumber : 1;
    this.sortBy = queryParams.sortBy ? queryParams.sortBy : 'createdAt';
    this.sortDirection =
      queryParams.sortDirection === SortDirectionEnum.asc
        ? queryParams.sortDirection
        : SortDirectionEnum.desc;
    this.pageSize = queryParams.pageSize ? queryParams.pageSize : 10;
    this.searchLoginTerm = queryParams.searchLoginTerm
      ? queryParams.searchLoginTerm
      : null;
    this.searchEmailTerm = queryParams.searchEmailTerm
      ? queryParams.searchEmailTerm
      : null;
    this.searchNameTerm = queryParams.searchNameTerm
      ? queryParams.searchNameTerm
      : null;
    this.skipItems = (this.pageNumber - 1) * this.pageSize;
    this.sortDirectionNumber =
      this.sortDirection === SortDirectionEnum.asc ? 1 : -1;
  }
  getPageCount(totalCount: number): number {
    return Math.ceil(totalCount / this.pageSize);
  }
  filterByLoginOrEmail() {
    let param;
    if (this.searchLoginTerm && this.searchEmailTerm) {
      param = {
        $or: [
          {
            'accountData.login': {
              $regex: this.searchLoginTerm,
              $options: 'i',
            },
          },
          {
            'accountData.email': {
              $regex: this.searchEmailTerm,
              $options: 'i',
            },
          },
        ],
      };
    } else if (this.searchLoginTerm && !this.searchEmailTerm) {
      param = {
        'accountData.login': { $regex: this.searchLoginTerm, $options: 'i' },
      };
    } else if (!this.searchLoginTerm && this.searchEmailTerm) {
      param = {
        'accountData.email': { $regex: this.searchEmailTerm, $options: 'i' },
      };
    } else {
      param = {};
    }
    return param;
  }
}

export enum SortDirectionEnum {
  desc = 'desc',
  asc = 'asc',
}
