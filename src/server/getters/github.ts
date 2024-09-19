// Reference: @author Surmon <https://github.com/surmon-china>

import axios from '../services/axios'
// @ts-ignore


const token = import.meta.env.SECRET_TOKEN

const graphqlGitHub = async <T = any>(query: string): Promise<T> => {
  return axios
    .request<any>({
      // https://github.com/settings/tokens
      // Set the environment variable in Netlify to store your private token
      
      // TODO: Look out.
      // Here I do not do the proxy on the server side, 
      // Authorization will be exposed in the browser,
      // which will cause potential hazards. 
      headers: { Authorization: `Bearer ${token}` },
      url: `https://api.github.com/graphql`, 
      method: 'POST',
      data: JSON.stringify({
        query: `query {
        user(login: "13Hong") {
          ${query}
        }
      }`
      })
    })
    .then((response: { data: { errors: any[]; data: { user: any } } }) => {
      
      return response.data.errors
        ? Promise.reject(response.data.errors.map((error) => error.message).join('; '))
        : Promise.resolve(response.data.data.user)
    })
}

const isISODateString = (dateString: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) return false
  
  return new Date(dateString).toISOString() === dateString
}


export const getGitHubContributions = async (from: string, to: string): Promise<any> => {
  if (!isISODateString(from) || !isISODateString(to)) {
    return Promise.reject('Invalid date string!')
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
