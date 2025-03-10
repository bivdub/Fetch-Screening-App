<template>
  <div class="drawer-side z-10">
    <label
      for="dog-drawer"
      aria-label="close sidebar"
      class="drawer-overlay"
    ></label>
    <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <!-- Sidebar content here -->
      <li
        v-for="dog in props.finalDogsArray"
        :key="dog.id"
        class="menu-title flex flex-row justify-between items-center"
      >
        <h2>{{ dog.name }}</h2>
        <img
          :src="dog.img"
          :alt="dog.img"
          class="rounded w-20 h-20 object-cover"
          width="100"
          height="100"
        />
        <Button @click="$emit('deleteDog', dog)" class="btn btn-primary">
          Remove
        </Button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { Dog } from '~/shared/types'

  interface Props {
    finalDogsArray?: Dog[]
  }

  const props = defineProps<Props>()
</script>

<style lang="scss" scoped></style>
