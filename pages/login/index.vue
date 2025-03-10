import { DogTable } from '../../.nuxt/components'; import ToastService from
'primevue/toastservice';
<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center justify-center h-screen">
      <div class="welcome-section prose">
        <h1 class="text-center">Welcome to DogFindr!</h1>
        <p class="px-3">
          This app will allow you to search for and select dogs up for adoption
          in your area. Just enter your your preferences for breed, age (leave
          Max. Age at 0 if you have no preference), and your location (Both City
          and State are required) and hit Search to see available dogs in your
          area. Picking a dog to adopt can be hard with so many options though!
          So add all the dogs you are interested in. When you are done
          selecting, review the dogs selected in the sidebar and click Find Your
          New Dog to have DogFindr select your new best friend!
        </p>
        <h3 class="text-center">
          To start just enter your name and email below!
        </h3>
      </div>
      <input
        @keypress.enter="submit"
        v-model="name"
        type="text"
        placeholder="Name"
        class="input my-3"
      />
      <input
        @keypress.enter="submit"
        v-model="email"
        type="Email"
        placeholder="email"
        class="input mb-3"
      />
      <div @click="submit" class="btn btn-primary">Log In</div>
    </div>
  </div>
</template>

<script async setup lang="ts">
  const name = ref('')
  const email = ref('')

  const submit = async () => {
    const body = JSON.stringify({
      name: name.value,
      email: email.value
    })

    if (name.value && email.value) {
      const res = await useFetch('api/auth/login', {
        method: 'POST',
        body
      })

      if (res.data.value === 'OK') {
        useState('auth', () => true)
        navigateTo('/')
      }
    }
  }
</script>

<style></style>
