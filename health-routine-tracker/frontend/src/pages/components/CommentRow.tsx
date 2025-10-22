import Button from '../../components/ui/Button';
import { removeComment, updateComment } from '../../lib/socialStore';
import { useState } from 'react';

export default function CommentRow({ id, nickname, createdAt, content, onDeleted, onUpdated }: { id: string; nickname: string; createdAt: string; content: string; onDeleted?: (id: string) => void; onUpdated?: (id: string, content: string) => void; }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(content);
  return (
    <div className="row">
      <div>
        <div style={{ fontWeight: 600 }}>{nickname}</div>
        <div className="muted" style={{ fontSize: 12 }}>{new Date(createdAt).toLocaleString()}</div>
        {!editing ? <div style={{ marginTop: 6 }}>{content}</div> : (
          <textarea value={text} onChange={(e)=> setText(e.target.value)} style={{ width: '100%', minHeight: 80 }} />
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!editing ? (
          <>
            <Button variant="ghost" onClick={() => setEditing(true)}>수정</Button>
            <Button variant="danger" onClick={async () => { await removeComment(id); if (onDeleted) onDeleted(id); else location.reload(); }}>삭제</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setEditing(false)}>취소</Button>
            <Button onClick={async () => { await updateComment(id, text); setEditing(false); if (onUpdated) onUpdated(id, text); else location.reload(); }}>저장</Button>
          </>
        )}
      </div>
    </div>
  );
}


