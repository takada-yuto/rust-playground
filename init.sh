#!/bin/bash

# エラーハンドリング: いずれかのコマンドが失敗した場合、スクリプトを終了する
set -e

export PATH="$PATH:/home/node/.linuxbrew/bin"

# CDKアプリケーションの初期化
mkdir tmp && mkdir tmp/backend && cd tmp/backend
cdk init app --language typescript

cd /app

# Rustアプリケーションの作成
cargo new backend
mv tmp/backend/* backend/
rm -rf tmp

cd backend

# 必要なモジュールインストール
npm i --save  @aws-cdk/aws-lambda @aws-cdk/core @aws-cdk/aws-s3 tsconfig-paths

# Next.jsアプリケーションの作成
cd .. && npm i create-next-app@latest

npx create-next-app@latest frontend --use-npm --ts --tailwind --eslint --app --src-dir --import-alias '@/*'

# Next.jsアプリケーションディレクトリに移動し、依存関係をインストール
cd frontend && npm i

brew install filosottile/musl-cross/musl-cross

echo "Initialization complete!"