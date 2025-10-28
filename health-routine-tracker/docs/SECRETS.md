# Secrets & Environment

## GitHub Actions Secrets (예시)
- `EC2_HOST`: EC2 퍼블릭 IP 또는 호스트네임
- `EC2_USER`: 기본 ubuntu (선택)
- `EC2_KEY`: SSH private key 내용
- `EC2_PATH`: 원격 경로(기본 /home/ubuntu/hrt)
- `DB_PASSWORD`, `DB_ROOT_PASSWORD`: 선택, 미설정 시 기본값 사용

## EC2(.env)
```
DB_PASSWORD=hrtpass
DB_ROOT_PASSWORD=rootpass
```

주의: .env는 레포에 커밋 금지. GitHub Public 저장소에 키/비밀번호를 올리지 말 것.


