export interface IAddComment {
  post_id: number;
  comment: string;
}

export interface ICreatePostRequest {
  html_content: string;
  categoryIds: number[];
  title: string;
  summary: string;
  coverImagePath?: string;
}

export interface IEditPostRequest {
  id: number;
  html_content: string;
  categoryIds: number[];
  title: string;
  summary: string;
  coverImagePath?: string;
}
