#!/usr/bin/env bash
set -euo pipefail

# Simple end-to-end smoke through Gateway (localhost:8080)
# Prereq: docker compose stack up; services registered in Eureka

BASE=${BASE_URL:-http://localhost:8080}
USER_ID=${USER_ID:-1}
TODAY=$(date +%F)

echo "[1] Gateway health"
curl -fsSL "$BASE/actuator/health" >/dev/null && echo " OK"

echo "[2] Routine service health"
curl -fsSL "$BASE/routines/health" >/dev/null && echo " OK"

echo "[3] Public routines (no auth/header)"
curl -fsS "$BASE/routines/public?page=1&size=5" | jq -r '.data.content | length as $n | " OK (" + ($n|tostring) + " items)"'

echo "[4] Create or upsert my routine (X-User-Id: $USER_ID)"
payload=$(cat <<JSON
{
  "routineDate": "$TODAY",
  "sleepHours": 7.5,
  "exerciseType": "WALK",
  "exerciseMinutes": 30,
  "meals": "salad",
  "waterMl": 1500,
  "note": "smoke test"
}
JSON
)
set +e
create=$(curl -s -o /tmp/resp.json -w "%{http_code}" -H "X-User-Id: $USER_ID" -H "Content-Type: application/json" -d "$payload" "$BASE/routines")
set -e
if [[ "$create" != "200" ]]; then
  echo "  Create returned $create. Trying id-by-date patch path..."
  rid=$(curl -fsS -H "X-User-Id: $USER_ID" "$BASE/routines?userId=$USER_ID&from=$TODAY&to=$TODAY" | jq -r '.data.content[0].id')
  curl -fsS -X PUT -H "X-User-Id: $USER_ID" -H "Content-Type: application/json" -d "$payload" "$BASE/routines/$rid" >/dev/null
  echo "  Updated routine id=$rid"
else
  rid=$(jq -r '.data.id' </tmp/resp.json)
  echo "  Created routine id=$rid"
fi

echo "[5] Comments flow"
cid=$(curl -fsS -X POST -H "X-User-Id: $USER_ID" -H "Content-Type: application/json" -d "{\"routineId\":$rid,\"content\":\"hello\"}" "$BASE/comments" | jq -r '.id // .data.id')
echo "  Comment id=$cid"
curl -fsS "$BASE/comments/routine/$rid" >/dev/null && echo "  List OK"

echo "[6] Likes flow"
curl -fsS -X POST -H "X-User-Id: $USER_ID" "$BASE/likes/routine/$rid" >/dev/null && echo "  Toggled like"
curl -fsS "$BASE/likes/routine/$rid/count" >/dev/null && echo "  Count OK"
# liked-by-me는 인증 필요 → 헤더 포함
curl -fsS -H "X-User-Id: $USER_ID" "$BASE/likes/routine/$rid/check" >/dev/null && echo "  Check OK"

echo "[DONE] Smoke OK"
