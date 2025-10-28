import type { CommentItem, LikeState } from '../types/social';
import { createComment, deleteCommentApi, isLikedByMeApi, likeCountApi, listCommentsApi, toggleLikeApi, updateCommentApi } from './api';

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
  try {
    const res = await listCommentsApi(Number(routineId), 0, 50);
    const arr = Array.isArray(res) ? res : (res?.content ?? []);
    return arr.map((c: any) => ({
      id: String(c.id),
      routineId: String(c.routineId ?? routineId),
      nickname: `user-${c.userId}`,
      content: c.content,
      createdAt: c.createdAt,
    }));
  } catch {
    return [];
  }
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
  const count = Number(await likeCountApi(Number(routineId))) || 0;
  let me = false;
  if (localStorage.getItem('hrt:token')) {
    me = await isLikedByMeApi(Number(routineId), getUserId());
  }
  return { routineId, likeCount: count, meLiked: me };
}
export async function toggleLike(routineId: string): Promise<LikeState> {
  await toggleLikeApi(Number(routineId), getUserId());
  const [count, liked] = await Promise.all([
    (async () => Number(await likeCountApi(Number(routineId))) || 0)(),
    isLikedByMeApi(Number(routineId), getUserId())
  ]);
  return { routineId, likeCount: count, meLiked: liked };
}

