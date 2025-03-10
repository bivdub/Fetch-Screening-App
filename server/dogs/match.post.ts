export default defineEventHandler(async (event) => {
  const body = JSON.stringify(await readBody(event))

  const response = await fetch(
    'https://frontend-take-home-service.fetch.com/dogs/match',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body,
      credentials: 'include'
    }
  )

  return response
})
