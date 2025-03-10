export default defineEventHandler(async (event) => {
  const response = await fetch(
    'https://frontend-take-home-service.fetch.com/dogs/breeds',
    {
      method: 'GET',
      credentials: 'include'
    }
  )

  return response
})
