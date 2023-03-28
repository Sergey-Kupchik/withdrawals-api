export interface IAllBlogsOutput {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: IBlog[];
}

export interface IBlog {
  id: string;
  name: string;
  websiteUrl: string;
  createdAt: string;
  description: string;
  isMembership: boolean;
}
