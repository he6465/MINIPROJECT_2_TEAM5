CREATE TABLE IF NOT EXISTS likes (
  like_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  routine_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_likes_routine_user UNIQUE (routine_id, user_id),
  INDEX idx_likes_routine (routine_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
