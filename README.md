## 環境
- docker 20.10.21
- docker compose 1.29.2

# 環境構築
1.  コンテナ立ち上げ
```
docker compose up -d
```

# 初期環境構築
1.  コンテナ立ち上げ
```
docker compose up -d
```

2.  コンテナに入る
```
docker compose exec app bash
```

3.  環境構築(frontend・backend)
```
./init.sh
```

4. Rustの設定(~/.cargo/config.toml)
```
[target.x86_64-unknown-linux-gnu]
linker = "x86_64-unknown-linux-gnu-gcc"
```

5. ビルドスクリプトの編集(backend/package.json)
```
"build": "rustup target add x86_64-unknown-linux-musl && cargo build --target=x86_64-unknown-linux-musl && mkdir -p ./target/cdk/release && cp ./target/x86_64-unknown-linux-musl/debug/bootstrap ./target/cdk/release/bootstrap",
```

6. Cargo.tomlの編集(backend/Cargo.toml)
```
[package]
name = "backend"
version = "0.1.0"
edition = "2021"
readme = "README.md"
license = "MIT"

[lib]
name = "lib"
path = "src/lib.rs"

[[bin]]
name = "bootstrap"
path = "src/bin/bootstrap.rs"

[dependencies]
lambda = { package = "netlify_lambda", version = "0.2.0" }
tokio = "1.5.0"
serde = "1.0.125"
serde_derive = "1.0.125"
serde_json = "1.0.64"

[dev-dependencies]
pretty_assertions = "0.7.2"
```

7. 関数ファイル作成(backend/src/bin/bootstrap.rs, backend/src/lib.rs)