import type { APIRoute } from 'astro'

// 禁用预渲染，让此 API 端点在服务端运行
export const prerender = false

const token = import.meta.env.GITHUB_TOKEN

export const POST: APIRoute = async ({ request }) => {
  try {
    // 解析请求体
    const { query } = await request.json()

    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400 })
    }

    if (!token) {
      return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not configured' }), { status: 500 })
    }

    // 请求 GitHub GraphQL API
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query {
          user(login: "13Hong") {
            ${query}
          }
        }`,
      }),
    })

    const data = await res.json()

    if (data.errors) {
      return new Response(
        JSON.stringify({ error: data.errors.map((e: any) => e.message).join('; ') }),
        { status: 500 },
      )
    }

    return new Response(JSON.stringify(data.data.user), { status: 200 })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

