/**
 * GitHub GraphQL API 客户端
 * 通过 /api/github 代理请求，Token 存储在服务端
 */

const graphqlGitHub = async <T = any>(query: string): Promise<T> => {
  const response = await fetch('/api/github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  
  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return data
}

const isISODateString = (dateString: string): boolean => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) {
    return false
  }
  return new Date(dateString).toISOString() === dateString
}

export const getGitHubContributions = async (from: string, to: string): Promise<any> => {
  if (!isISODateString(from) || !isISODateString(to)) {
    throw new Error('Invalid date string!')
  }

  const result = await graphqlGitHub(`
    contributionsCollection(from: "${from}", to: "${to}") {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            weekday
            date
            contributionCount
            color
          }
        }
      }
    }
  `)

  return result.contributionsCollection.contributionCalendar
}

