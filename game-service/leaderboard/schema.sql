CREATE TABLE IF NOT EXISTS students(id TEXT PRIMARY KEY,alias TEXT NOT NULL,class_name TEXT NOT NULL,created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,student TEXT NOT NULL,class_name TEXT NOT NULL,source_hash TEXT NOT NULL,source_identity TEXT NOT NULL,grants TEXT NOT NULL,verified INTEGER NOT NULL,expires INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS session_expiry ON sessions(expires);
CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,student TEXT NOT NULL,course TEXT NOT NULL,lesson TEXT NOT NULL,client_id TEXT NOT NULL,started INTEGER NOT NULL,expires INTEGER NOT NULL,result TEXT,UNIQUE(student,client_id));
CREATE INDEX IF NOT EXISTS runs_owner ON runs(student,started);
CREATE INDEX IF NOT EXISTS run_expiry ON runs(expires);
CREATE TABLE IF NOT EXISTS progress(student TEXT NOT NULL,course TEXT NOT NULL,lesson TEXT NOT NULL,done TEXT NOT NULL,stars INTEGER NOT NULL DEFAULT 0,updated INTEGER NOT NULL,PRIMARY KEY(student,course,lesson));
CREATE TABLE IF NOT EXISTS records(student TEXT NOT NULL,course TEXT NOT NULL,lesson TEXT NOT NULL,period TEXT NOT NULL,points INTEGER NOT NULL,total INTEGER NOT NULL,stars INTEGER NOT NULL,elapsed INTEGER NOT NULL,finished INTEGER NOT NULL,PRIMARY KEY(student,course,lesson,period));
CREATE INDEX IF NOT EXISTS records_period ON records(period,course,student);
CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,window INTEGER NOT NULL,count INTEGER NOT NULL);
-- Durable personal history survives the short-lived run/answer cleanup.
CREATE TABLE IF NOT EXISTS journey_runs(student TEXT NOT NULL,run TEXT NOT NULL,course TEXT NOT NULL,lesson TEXT NOT NULL,points INTEGER NOT NULL,stars INTEGER NOT NULL,total INTEGER NOT NULL,correct INTEGER NOT NULL,study_ms INTEGER NOT NULL,finished INTEGER NOT NULL,complete INTEGER NOT NULL,legacy INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(student,run));
CREATE INDEX IF NOT EXISTS journey_owner ON journey_runs(student,finished);
