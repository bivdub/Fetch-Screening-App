export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useState('auth')

  if (auth && to.path === '/login') {
    return navigateTo('/')
  }

  if (!auth) {
    return navigateTo('/login')
  }
})
