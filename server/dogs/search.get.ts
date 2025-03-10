export default defineEventHandler(async (event) => {
  const body = JSON.stringify(await readBody(event))

  const response = await fetch(
    buildRequest(
      'https://frontend-take-home-service.fetch.com/dogs/search',
      body
    ),
    {
      method: 'GET',
      credentials: 'include'
    }
  )

  return response
})

const buildRequest = (baseUrl: string, params) => {
  const url = new URL(baseUrl)
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  )
  return url
}
