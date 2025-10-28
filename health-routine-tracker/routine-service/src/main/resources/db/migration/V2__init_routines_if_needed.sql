CREATE TABLE IF NOT EXISTS routines (
  routine_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  routine_date DATE NOT NULL,
  sleep_hours DECIMAL(3,1) NULL,
  exercise_type VARCHAR(30) NULL,
  exercise_minutes INT NULL,
  meals VARCHAR(1000) NULL,
  water_ml INT NULL,
  note TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uk_routines_user_date UNIQUE (user_id, routine_date),
  INDEX idx_routines_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
