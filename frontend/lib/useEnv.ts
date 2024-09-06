import useSWR from "swr"

interface Env {
  lambdaFunctionURL: string | undefined
}

const fetcher = async () => {
  const res = await fetch("/env.json")
  return res.json()
}

export default function useEnv() {
  const { data: env } = useSWR<Env>("/env.json", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  if (!env) {
    return {
      env: Object.freeze({
        lambdaFunctionURL: process.env.NEXT_PUBLIC_LAMBDA_FUNCTION_URL,
      }) as Env,
    }
  }

  return { env: Object.freeze(env) }
}
