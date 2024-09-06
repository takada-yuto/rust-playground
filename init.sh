#!/bin/bash

# エラーハンドリング: いずれかのコマンドが失敗した場合、スクリプトを終了する
set -e

mkdir backend && cd backend

# CDKアプリケーションの初期化
cdk init app --language typescript
# 必要なモジュールインストール
npm i --save  @aws-cdk/aws-lambda @aws-cdk/core @aws-cdk/aws-s3 tsconfig-paths

# Next.jsアプリケーションの作成
cd .. && npm i create-next-app@latest

npx create-next-app@latest frontend --use-npm --ts --tailwind --eslint --app --src-dir --import-alias '@/*'

# Rustアプリケーションの作成
cargo new api

# Next.jsアプリケーションディレクトリに移動し、依存関係をインストール
cd frontend && npm i

echo "Initialization complete!"