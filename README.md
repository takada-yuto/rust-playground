## 環境
- docker 20.10.21
- docker compose 1.29.2

# 環境構築
1.  コンテナ立ち上げ
```
docker compose up -d
```

2.  コンテナに入る
```
docker compose exec app bash
```

3.  環境構築(frontend・backend・api)
```
./init.sh
```