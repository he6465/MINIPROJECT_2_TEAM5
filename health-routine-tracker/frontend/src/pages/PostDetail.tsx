import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteRoutine, useRoutine, useComments } from '../lib/queries';
import { addComment, getLike, removeComment, toggleLike, updateComment } from '../lib/socialStore';
import { useEffect, useState } from 'react';
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
  const { data: comments = [], refetch: refetchComments } = useComments(id ?? '');
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLike(await getLike(id));
    })();
  }, [id]);

  return (
    <Section>
      {!item && <Empty message="This routine does not exist." />}
      {item && (
        <>
          <div className="modern-card container-narrow" style={{ display: 'grid', gap: 16 }}>
            <div className="section-head"><h2>{item.date} Routine</h2><span className="chip">{item.exerciseType ?? '-'}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'stretch' }}>
              <div className="kpi" style={{ borderTop: '4px solid var(--green-700)', minHeight: 112 }}>
                <div className="kpi-title">Sleep</div>
                <div className="kpi-value">{item.sleepHours ?? '-'} h</div>
              </div>
              <div className="kpi" style={{ borderTop: '4px solid var(--green-500)', minHeight: 112 }}>
                <div className="kpi-title">Exercise</div>
                <div className="kpi-value">{item.exerciseMinutes ?? 0} min</div>
              </div>
              <div className="kpi" style={{ borderTop: '4px solid var(--lime-300)', minHeight: 112 }}>
                <div className="kpi-title">Water</div>
                <div className="kpi-value">{item.waterMl ?? 0} ml</div>
              </div>
            </div>
            {item.meals && <div><strong>Meals</strong><div>{item.meals}</div></div>}
            {item.note && <div><strong>Note</strong><div>{item.note}</div></div>}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Button onClick={() => navigate(`/posts/${id}/edit`)}>Edit</Button>
              <Button variant="danger" onClick={() => setConfirm(true)}>Delete</Button>
              <Button variant="ghost" onClick={async () => {
                if (!localStorage.getItem('hrt:token')) { alert('Login required'); navigate('/login'); return; }
                if (id) { const s = await toggleLike(id); setLike(s); }
              }}>
                {like.meLiked ? 'Unlike' : 'Like'} ({like.likeCount})
              </Button>
            </div>
          </div>

          <div className="modern-card container-narrow" style={{ display: 'grid', gap: 8 }}>
            <h3>Comments</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {comments.map((c: any) => (
                <CommentRow
                  key={c.id}
                  id={c.id}
                  nickname={c.nickname}
                  createdAt={c.createdAt}
                  content={c.content}
                  onDeleted={async () => { await refetchComments(); }}
                  onUpdated={async () => { await refetchComments(); }}
                />
              ))}
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!id) return;
                if (!localStorage.getItem('hrt:token')) { alert('Login required'); navigate('/login'); return; }
                try {
                  await addComment(id, 'guest', commentText);
                  setCommentText('');
                  await refetchComments();
                  push('Comment added', 'success');
                } catch (err: any) { push(err?.message ?? 'ERROR', 'error'); }
              }} style={{ display: 'flex', gap: 8 }}>
                <input value={commentText} onChange={(e)=> setCommentText(e.target.value)} placeholder="Add a comment (1-500 chars)" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-fg)' }} />
                <Button type="submit">Add</Button>
              </form>
            </div>
          </div>

          <Modal open={confirm} onClose={() => setConfirm(false)} title="Confirm delete" actions={
            <>
              <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
              <Button variant="danger" onClick={async () => { if (id) { await del.mutateAsync(id); push('Deleted', 'success'); navigate('/posts'); } }}>Delete</Button>
            </>
          }>
            Delete this routine? This action cannot be undone.
          </Modal>
        </>
      )}
    </Section>
  );
}
