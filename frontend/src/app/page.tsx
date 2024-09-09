"use client"

import { useState } from "react"
import useEnv from "../../lib/useEnv"

export default function Home() {
  const [lambdaMessage, setLambdaMessage] = useState("")
  const [pythonLambdaMessage, setPythonLambdaMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)  // ローディング状態を管理
  const [isPythonLoading, setIsPythonLoading] = useState(false)  // Python用のローディング状態を管理
  const { env } = useEnv() // S3のenv.jsonから環境変数を取得

  const handler = async () => {
    setIsLoading(true)  // ボタン押下時にローディング状態に設定
    const lambdaFunctionURL = env.lambdaFunctionURL

    if (!lambdaFunctionURL) return

    try {
      const response = await fetch(lambdaFunctionURL)
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`)
      }
      const data = await response.json()
      console.log("Data received from API:", data)
      setLambdaMessage(data.execution_time_ms)
    } catch (e) {
      setLambdaMessage(`Error: ${(e as Error).toString()}`)
      console.error("Failed to fetch data from API", e)
    } finally {
      setIsLoading(false)  // 処理完了後にローディング状態を解除
    }
  }

  const pythonHandler = async () => {
    setIsPythonLoading(true)  // ボタン押下時にローディング状態に設定
    const pythonLambdaFunctionURL = env.pythonLambdaFunctionURL

    if (!pythonLambdaFunctionURL) return

    try {
      const response = await fetch(pythonLambdaFunctionURL)
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`)
      }
      const data = await response.json()
      console.log("Data received from API:", data)
      setPythonLambdaMessage(data.execution_time_ns)
    } catch (e) {
      setPythonLambdaMessage(`Error: ${(e as Error).toString()}`)
      console.error("Failed to fetch data from API", e)
    } finally {
      setIsPythonLoading(false)  // 処理完了後にローディング状態を解除
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <div className="flex items-center justify-center bg-gray-100">
        <button
          onClick={handler}
          className="px-6 py-3 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          disabled={isLoading}  // ローディング中はボタンを無効化
        >
          {isLoading ? "Loading..." : "Invoke Rust Lambda"}
        </button>
        {lambdaMessage && <p className="ml-4">{lambdaMessage}</p>}
      </div>
      <div className="flex items-center justify-center bg-gray-100">
        <button
          onClick={pythonHandler}
          className="px-6 py-3 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          disabled={isPythonLoading}  // ローディング中はボタンを無効化
        >
          {isPythonLoading ? "Loading..." : "Invoke Python Lambda"}
        </button>
        {pythonLambdaMessage && <p className="ml-4">{pythonLambdaMessage}</p>}
      </div>
    </div>
  )
}