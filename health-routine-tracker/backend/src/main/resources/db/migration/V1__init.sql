-- Flyway V1: Initial schema migrated from Health_Routine_Tracker.sql (subset)

CREATE TABLE IF NOT EXISTS users (
  user_id       BIGINT NOT NULL AUTO_INCREMENT,
  email         VARCHAR(100) NOT NULL,
  username      VARCHAR(50)  NOT NULL,
  nickname      VARCHAR(50)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_users PRIMARY KEY (user_id),
  CONSTRAINT uk_users_email    UNIQUE (email),
  CONSTRAINT uk_users_nickname UNIQUE (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS routines (
  routine_id        BIGINT      NOT NULL AUTO_INCREMENT,
  user_id           BIGINT      NOT NULL,
  routine_date      DATE        NOT NULL,
  sleep_hours       DECIMAL(3,1),
  exercise_type     VARCHAR(30),
  exercise_minutes  INT,
  meals             VARCHAR(1000),
  water_ml          INT,
  note              TEXT,
  created_at        TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_routines PRIMARY KEY (routine_id),
  CONSTRAINT fk_routines_user FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT uk_routines_user_date UNIQUE (user_id, routine_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX IF NOT EXISTS idx_routines_user_date ON routines (user_id, routine_date);

CREATE TABLE IF NOT EXISTS comments (
  comment_id  BIGINT     NOT NULL AUTO_INCREMENT,
  routine_id  BIGINT     NOT NULL,
  user_id     BIGINT     NOT NULL,
  content     TEXT       NOT NULL,
  created_at  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_comments PRIMARY KEY (comment_id),
  CONSTRAINT fk_comments_routine FOREIGN KEY (routine_id)
    REFERENCES routines(routine_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_comments_user    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX IF NOT EXISTS idx_comments_routine_created ON comments (routine_id, created_at);

CREATE TABLE IF NOT EXISTS likes (
  like_id     BIGINT     NOT NULL AUTO_INCREMENT,
  routine_id  BIGINT     NOT NULL,
  user_id     BIGINT     NOT NULL,
  created_at  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_likes PRIMARY KEY (like_id),
  CONSTRAINT fk_likes_routine FOREIGN KEY (routine_id)
    REFERENCES routines(routine_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_likes_user    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT uk_likes_unique UNIQUE (routine_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


