import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteRoutine, useRoutine } from '../lib/queries';
import { addComment, getLike, listComments, removeComment, toggleLike, updateComment } from '../lib/socialStore';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Section from '../components/Section';
import CommentRow from './components/CommentRow';
import { useToast } from '../components/ui/Toast';
import { Empty } from '../components/ui/State';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item } = useRoutine(id ?? '');
  const del = useDeleteRoutine();
  const { push } = useToast();
  const [like, setLike] = useState({ routineId: '', likeCount: 0, meLiked: false });
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLike(await getLike(id));
      const list = await listComments(id);
      setComments(list);
    })();
  }, [id]);

  return (
    <Section>
      {!item && <Empty message="존재하지 않는 루틴입니다." />}
      {item && (
        <>
          <div className="modern-card container-narrow" style={{ display: 'grid', gap: 16 }}>
            <div className="section-head"><h2>{item.date} 루틴</h2><span className="chip">{item.exerciseType ?? '-'}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'stretch' }}>
              <div className="kpi" style={{ borderTop: '4px solid var(--green-700)', minHeight: 112 }}>
                <div className="kpi-title">수면</div>
                <div className="kpi-value">{item.sleepHours ?? '-'} h</div>
              </div>
              <div className="kpi" style={{ borderTop: '4px solid var(--green-500)', minHeight: 112 }}>
                <div className="kpi-title">운동</div>
                <div className="kpi-value">{item.exerciseMinutes ?? 0} 분</div>
              </div>
              <div className="kpi" style={{ borderTop: '4px solid var(--lime-300)', minHeight: 112 }}>
                <div className="kpi-title">물</div>
                <div className="kpi-value">{item.waterMl ?? 0} ml</div>
              </div>
            </div>
            {item.meals && <div><strong>식사</strong><div>{item.meals}</div></div>}
            {item.note && <div><strong>메모</strong><div>{item.note}</div></div>}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Button onClick={() => navigate(`/posts/${id}/edit`)}>수정</Button>
              <Button variant="danger" onClick={() => setConfirm(true)}>삭제</Button>
              <Button variant="ghost" onClick={async () => {
                if (!localStorage.getItem('hrt:token')) { alert('로그인이 필요합니다.'); navigate('/login'); return; }
                if (id) { const s = await toggleLike(id); setLike(s); }
              }}>
                {like.meLiked ? '좋아요 취소' : '좋아요'} ({like.likeCount})
              </Button>
            </div>
          </div>
          <div className="modern-card container-narrow" style={{ display: 'grid', gap: 8 }}>
            <h3>댓글</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {comments.map(c => (
                <CommentRow
                  key={c.id}
                  id={c.id}
                  nickname={c.nickname}
                  createdAt={c.createdAt}
                  content={c.content}
                  onDeleted={(cid) => setComments(prev => prev.filter(x => x.id !== cid))}
                  onUpdated={(cid, text) => setComments(prev => prev.map(x => x.id === cid ? { ...x, content: text } : x))}
                />
              ))}
              <form onSubmit={async (e) => { e.preventDefault(); if (!id) return; if (!localStorage.getItem('hrt:token')) { alert('로그인이 필요합니다.'); navigate('/login'); return; } try { const added = await addComment(id, '게스트', commentText); setComments(prev => [...prev, added]); setCommentText(''); push('댓글이 등록되었습니다.', 'success'); } catch (err: any) { push(err?.message ?? 'ERROR', 'error'); } }} style={{ display: 'flex', gap: 8 }}>
                <input value={commentText} onChange={(e)=> setCommentText(e.target.value)} placeholder="댓글을 입력하세요 (1~500자)" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-fg)' }} />
                <Button type="submit">등록</Button>
              </form>
            </div>
          </div>
          <Modal open={confirm} onClose={() => setConfirm(false)} title="삭제 확인" actions={
            <>
              <Button variant="ghost" onClick={() => setConfirm(false)}>취소</Button>
              <Button variant="danger" onClick={async () => { if (id) { await del.mutateAsync(id); push('삭제되었습니다.', 'success'); navigate('/posts'); } }}>삭제</Button>
            </>
          }>
            이 루틴을 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.
          </Modal>
        </>
      )}
    </Section>
  );
}


