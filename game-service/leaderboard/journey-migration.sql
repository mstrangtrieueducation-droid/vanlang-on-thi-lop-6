-- Additive and replay-safe. Never infer attempts whose records no longer exist.
INSERT OR IGNORE INTO journey_runs
SELECT student,client_id,course,lesson,json_extract(result,'$.points'),json_extract(result,'$.stars'),json_extract(result,'$.total'),json_extract(result,'$.correct'),json_extract(result,'$.elapsedMs'),json_extract(result,'$.receivedAt'),CASE WHEN json_extract(result,'$.stars')>0 THEN 1 ELSE 0 END,1 FROM runs WHERE result IS NOT NULL;
INSERT OR IGNORE INTO journey_runs
SELECT r.student,'legacy:'||r.course||':'||r.lesson,r.course,r.lesson,r.points,r.stars,r.total,r.points/10,r.elapsed,r.finished,1,1 FROM records r WHERE period='all' AND NOT EXISTS(SELECT 1 FROM journey_runs j WHERE j.student=r.student AND j.course=r.course AND j.lesson=r.lesson);
