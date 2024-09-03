#!/bin/bash

# エラーハンドリング: いずれかのコマンドが失敗した場合、スクリプトを終了する
set -e

mkdir backend && cd backend

# CDKアプリケーションの初期化
cdk init app --language typescript

# Next.jsアプリケーションの作成
cd .. && npm i create-next-app@latest

npx create-next-app@latest frontend --use-npm --ts --tailwind --eslint --app --src-dir --import-alias '@/*'

# Rustアプリケーションの作成
cargo new api

# Next.jsアプリケーションディレクトリに移動し、依存関係をインストール
cd frontend && npm i

echo "Initialization complete!"