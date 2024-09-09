use lambda::Context;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::env;
use std::time::Instant;

pub type LambdaError = Box<dyn std::error::Error + Send + Sync + 'static>;

fn is_prime(n: u64) -> bool {
    if n <= 1 {
        return false;
    }
    if n <= 3 {
        return true;
    }
    if n % 2 == 0 || n % 3 == 0 {
        return false;
    }
    let mut i = 5;
    while (i * i) <= n {
        if n % i == 0 || n % (i + 2) == 0 {
            return false;
        }
        i += 6;
    }
    true
}

pub async fn handler(event: Value, _: Context) -> Result<Value, LambdaError> {
    let start_time = Instant::now();
    let cloudfront_url = env::var("CLOUDFRONT_URL").unwrap_or_else(|_| "https://default-cloudfront-url.com".to_string());
    println!("cloudfront_url: {}", cloudfront_url);

    // 許可されたオリジンを定義
    let allowed_origins = vec![
        cloudfront_url.clone(), // 取得したURLはString型
        "http://localhost:3000".to_string(), // リテラルをString型に変換
    ];

    // // リクエストのオリジンを取得
    let origin = event["headers"]["origin"].as_str().unwrap_or("").to_string();
    println!("Origin: {}", origin);
    
    // // オリジンが許可されているかどうかをチェック
    let is_allowed_origin = allowed_origins.contains(&origin);
    println!("is_allowed_origin: {}", is_allowed_origin);

    // レスポンスヘッダーを設定
    let mut headers = HashMap::new();
    headers.insert("Content-Type", "application/json");
    headers.insert("Access-Control-Allow-Headers", "Content-Type");

    
    if is_allowed_origin {
        headers.insert("Access-Control-Allow-Origin", "*");
        let mut count = 0;
        for number in 1..1_000_000 + 1 {
            if is_prime(number) {
                count += 1;
            }
        }
        let duration = start_time.elapsed();
        // レスポンスを返す
        Ok(json!({
            "statusCode": 200,
            "headers": headers,
            "body": json!({
                "message": "Hello from Rust Lambda!",
                "count": count,
                "execution_time_ms": duration.as_nanos()
            }).to_string()
        }))
    } else {
        // 許可されていないオリジンからのアクセスの場合に400エラーを返す
        Ok(json!({
            "statusCode": 400,
            "headers": headers,
            "body": json!({
                "error": "Origin not allowed"
            }).to_string()
        }))
    }
}