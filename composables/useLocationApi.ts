export function useLocationApi() {
  const getLocationDetails = async (city: string, states: string) => {
    const result: Record<string, any> = await $fetch('/api/locations/search', {
      method: 'POST',
      body: {
        city: city,
        states: [states]
      }
    })

    return { result: result }
  }

  // Return all the composable's functions for use in components
  return { getLocationDetails }
}
