/* =========================================================
   Health Routine Tracker - Production Ready SQL (MariaDB)
   - Schema: BIGINT PK/FK (ERD와 호환)
   - Plan spec 반영: UNIQUE/INDEX/updated_at 등
   - Safe defaults: utf8mb4, STRICT mode
   - 시드: 실전 개발용 최소 데이터
   ---------------------------------------------------------
   실행 순서: 이 파일 전체를 HeidiSQL에서 그대로 실행
   ========================================================= */

-- (선택) 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS health_routine
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE health_routine;

-- 개발 편의 설정
SET sql_mode = 'STRICT_ALL_TABLES';

-- 기존 객체 정리
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS routines;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

/* ======================
   USERS
   - PK: BIGINT
   - UK: email, nickname  (계획서)
   ====================== */
CREATE TABLE users (
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

/* ======================
   ROUTINES
   - PK: BIGINT
   - UK: (user_id, routine_date)   ← 하루 1개 (계획서)
   - IDX: (user_id, routine_date)  (계획서 NFR)
   - exercise_type: 계획서의 enum 취지 → 문자열로 관리 (RUN/WALK/GYM/ETC)
   ====================== */
CREATE TABLE routines (
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

CREATE INDEX idx_routines_user_date ON routines (user_id, routine_date);

/* ======================
   COMMENTS
   - PK: BIGINT
   - FK: routines/user
   - IDX: (routine_id, created_at)
   - updated_at 포함 (계획서: 댓글 수정 지원)
   ====================== */
CREATE TABLE comments (
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

CREATE INDEX idx_comments_routine_created ON comments (routine_id, created_at);

/* ======================
   LIKES
   - PK: BIGINT
   - UK: (routine_id, user_id)  ← 토글/중복 방지 (계획서)
   ====================== */
CREATE TABLE likes (
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

/* ======================
   ⚠️ 값 검증(애플리케이션 레벨 권장, 계획서 기준)
   - sleep_hours: 0.0 ~ 16.0
   - exercise_minutes: 0 ~ 600
   - water_ml: 0 ~ 10000
   - exercise_type ∈ {RUN, WALK, GYM, ETC}
   ====================== */

/* =========================================================
   SEED DATA (실전 개발용 미니멈)
   - 패스워드 해시는 데모 값(실서비스는 bcrypt 사용)
   - exercise_type은 계획서 규격으로만 입력
   ========================================================= */
INSERT INTO users (email, username, nickname, password_hash) VALUES
('alice@example.com', 'alice', '앨리스', '$2y$10$DEMO_HASH_ALICE'),
('bob@example.com',   'bob',   '밥',    '$2y$10$DEMO_HASH_BOB');

-- Day0 ~ Day2 샘플 (바로 API/E2E 확인 가능)
INSERT INTO routines (user_id, routine_date, sleep_hours, exercise_type, exercise_minutes, meals, water_ml, note) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 7.5, 'RUN',  30, '아:샐러드 점:현미 저:닭가슴살', 2000, '야식 참음'),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 6.0, 'GYM',  45, '아:오트밀 점:샌드 저:스테이크', 1800, '웨이트 위주'),
(1, CURDATE(),                           7.0, 'WALK', 40, '아:베이글 점:비빔밥 저:연어',   2200, '컨디션 양호'),
(2, CURDATE(),                           6.5, 'ETC',  25, '아:토스트 점:샐러드 저:수프',   1500, '가볍게 운동');

-- 댓글/좋아요 시드
INSERT INTO comments (routine_id, user_id, content) VALUES
(1, 2, '루틴 관리 아주 좋네요!'),
(3, 2, '수면시간 유지 굿!');

INSERT INTO likes (routine_id, user_id) VALUES
(1, 2),
(3, 2);

-- 검증용 조회
SELECT COUNT(*) AS users_cnt FROM users;
SELECT COUNT(*) AS routines_cnt FROM routines;
SELECT COUNT(*) AS comments_cnt FROM comments;
SELECT COUNT(*) AS likes_cnt FROM likes;
