import type { CommentItem, LikeState } from '../types/social';
import { createComment, deleteCommentApi, isLikedByMeApi, likeCountApi, listCommentsApi, toggleLikeApi, updateCommentApi } from './api';

// Helper: 로그인 사용자 ID (데모로 localStorage에서 보관된 유저 사용)
function getUserId(): number {
  try {
    const raw = localStorage.getItem('hrt:user');
    if (!raw) return 1;
    const u = JSON.parse(raw);
    return Number(u.id) || 1;
  } catch { return 1; }
}

// Comments
export async function listComments(routineId: string): Promise<CommentItem[]> {
  // 비로그인 시에는 보호 API 호출을 피하고 빈 목록 반환
  if (!localStorage.getItem('hrt:token')) return [];
  const res = await listCommentsApi(Number(routineId), 0, 50);
  return res.content.map((c: any) => ({ id: String(c.id), routineId: String(c.routineId), nickname: `user-${c.userId}`, content: c.content, createdAt: c.createdAt }));
}
export async function addComment(routineId: string, nickname: string, content: string): Promise<CommentItem> {
  const userId = getUserId();
  const c = await createComment(Number(routineId), userId, content);
  return { id: String(c.id), routineId, nickname: nickname || `user-${c.userId}`, content: c.content, createdAt: c.createdAt };
}
export async function removeComment(id: string) {
  const userId = getUserId();
  await deleteCommentApi(Number(id), userId);
}
export async function updateComment(id: string, content: string) {
  const userId = getUserId();
  const text = (content ?? '').trim();
  await updateCommentApi(Number(id), userId, text);
}

// Likes
export async function getLike(routineId: string): Promise<LikeState> {
  const count = await likeCountApi(Number(routineId));
  let me = false;
  if (localStorage.getItem('hrt:token')) {
    me = await isLikedByMeApi(Number(routineId), getUserId());
  }
  return { routineId, likeCount: count, meLiked: me };
}
export async function toggleLike(routineId: string): Promise<LikeState> {
  const res = await toggleLikeApi(Number(routineId), getUserId());
  return { routineId, likeCount: res.likeCount, meLiked: res.liked };
}


