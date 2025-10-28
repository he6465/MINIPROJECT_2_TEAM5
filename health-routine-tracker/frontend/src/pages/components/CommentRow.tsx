import Button from '../../components/ui/Button';
import { removeComment, updateComment } from '../../lib/socialStore';
import { useState } from 'react';

type Props = {
  id: string;
  nickname: string;
  createdAt: string;
  content: string;
  onDeleted?: (id: string) => Promise<void> | void;
  onUpdated?: (id: string, content: string) => Promise<void> | void;
};

export default function CommentRow({ id, nickname, createdAt, content, onDeleted, onUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(content);
  return (
    <div className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{nickname}</div>
        <div className="muted" style={{ fontSize: 12 }}>{new Date(createdAt).toLocaleString()}</div>
        {!editing ? (
          <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{content}</div>
        ) : (
          <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', minHeight: 80 }} />
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!editing ? (
          <>
            <Button variant="ghost" onClick={() => setEditing(true)}>수정</Button>
            <Button
              variant="danger"
              onClick={async () => {
                // Always perform delete, then notify parent to refetch
                await removeComment(id);
                if (onDeleted) await onDeleted(id);
              }}
            >
              삭제
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setEditing(false)}>취소</Button>
            <Button
              onClick={async () => {
                // Always perform update, then notify parent to refetch
                await updateComment(id, text);
                if (onUpdated) await onUpdated(id, text);
                setEditing(false);
              }}
            >
              저장
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
