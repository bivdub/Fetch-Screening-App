export function useDogsApi() {
  const loadIds = async (params: Record<string, any>) => {
    const { data, error } = await useFetch(`/api/dogs/search`, {
      params
    })

    if (error.value?.statusCode === 401) {
      return navigateTo('/login')
    }

    return { result: data }
  }

  const loadDogDetails = async (ids: string[]) => {
    const { data, error } = await useFetch('/api/dogs', {
      method: 'POST',
      body: JSON.stringify(ids)
    })

    if (error.value?.statusCode === 401) {
      return navigateTo('/login')
    }

    return { result: data }
  }

  const getIds = async (params: Record<string, any>) => {
    const result: Record<string, any> = await $fetch(`/api/dogs/search`, {
      method: 'GET',
      query: params,
      async onResponseError({ request, response }) {
        if (response.status === 401) {
          navigateTo('/login')
        }
      }
    })

    return { result: result }
  }

  const getDogDetails = async (ids: string[]) => {
    const result: Record<string, any> = await $fetch('/api/dogs', {
      method: 'POST',
      body: JSON.stringify(ids),
      async onResponseError({ request, response }) {
        if (response.status === 401) {
          navigateTo('/login')
        }
      }
    })

    return { result: result }
  }

  const getFinalDog = async (dogs: string[]) => {
    const result: Record<string, any> = await $fetch('/api/dogs/match', {
      method: 'POST',
      body: JSON.stringify(dogs),
      async onResponseError({ request, response }) {
        if (response.status === 401) {
          navigateTo('/login')
        }
      }
    })

    return { result: result }
  }

  return { getIds, getDogDetails, loadIds, loadDogDetails, getFinalDog }
}
