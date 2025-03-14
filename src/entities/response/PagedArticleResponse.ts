import { SimpleRecruitmentResponse } from './SimpleRecruitmentResponse';

export interface PagedArticleResponse {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    data: SimpleRecruitmentResponse[];
}
