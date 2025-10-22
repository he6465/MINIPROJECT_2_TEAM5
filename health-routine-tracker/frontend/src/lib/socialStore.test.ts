import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { addComment, getLike, listComments, removeComment, toggleLike, updateComment } from './socialStore';

function resetLS() { localStorage.clear(); }

describe('socialStore', () => {
  beforeEach(resetLS); afterEach(resetLS);

  test('comments add/list/update/remove', () => {
    const c = addComment('r1', 'alice', 'hello <b>world</b>');
    const list = listComments('r1');
    expect(list.length).toBe(1);
    expect(list[0].content).toContain('&lt;b&gt;');
    updateComment(c.id, 'edited');
    expect(listComments('r1')[0].content).toBe('edited');
    removeComment(c.id);
    expect(listComments('r1').length).toBe(0);
  });

  test('likes toggle and persist', () => {
    expect(getLike('r1').likeCount).toBe(0);
    const a = toggleLike('r1');
    expect(a.meLiked).toBe(true);
    expect(a.likeCount).toBe(1);
    const b = toggleLike('r1');
    expect(b.meLiked).toBe(false);
    expect(b.likeCount).toBe(0);
  });
});


