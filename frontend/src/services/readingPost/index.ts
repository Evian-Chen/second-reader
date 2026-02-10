import api from "../api";

import type {
  CreateReadingPostRequest,
  CreateReadingPostResponse,
  DeleteReadingPostPath,
  DeleteReadingPostResponse,
  GetReadingPostByIdPath,
  GetReadingPostByIdResponse,
  GetReadingPostsByAccountIdPath,
  GetReadingPostsByAccountIdResponse,
  GetReadingPostsResponse,
  LikeReadingPostPath,
  LikeReadingPostRequest,
  LikeReadingPostResponse,
  UpdateReadingPostPath,
  UpdateReadingPostRequest,
  UpdateReadingPostResponse
} from "@/types/readingPost";

export default {
  getAllReadingPosts: () =>
    api<GetReadingPostsResponse>('get', '/reading-posts'),

  getReadingPostById: (param: GetReadingPostByIdPath) => {
    if (!param.id) throw new Error("Reading post Id is required.");
    return api<GetReadingPostByIdResponse>('get', `/reading-posts/${param.id}`);
  },

  getReadingPostsByAccountId: (param: GetReadingPostsByAccountIdPath) => {
    if (param.accountId) throw new Error("Account Id is required.");
    return api<GetReadingPostsByAccountIdResponse>('get', `/reading-posts/${param.accountId}`);
  },

  createReadingPost: (params: CreateReadingPostRequest) =>
    api<CreateReadingPostResponse>('post', '/reading-posts', params),

  updateReadingPostById: (param: UpdateReadingPostPath, postData: UpdateReadingPostRequest) => {
    if (!param.id) throw new Error("Reading post Id is required.");
    return api<UpdateReadingPostResponse>('put', `/reading-posts/${param.id}`, postData);
  },

  deleteReadingPostById: (param: DeleteReadingPostPath) => {
    if (!param.id) throw new Error("Reading post Id is required.");
    return api<DeleteReadingPostResponse>('delete', `/reading-posts/${param.id}`);
  },

  likeReadingPostById: (param: LikeReadingPostPath, like: LikeReadingPostRequest) => {
    if (!param.id) throw new Error("Reading post Id is required.");
    return api<LikeReadingPostResponse>('put', `/reading-posts/${param.id}`, like);
  }
}
