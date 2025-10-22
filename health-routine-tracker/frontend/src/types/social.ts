export interface CommentItem {
  id: string;
  routineId: string;
  nickname: string;
  content: string; // 1~500
  createdAt: string;
}

export interface LikeState {
  routineId: string;
  likeCount: number;
  meLiked: boolean;
}


