<template>
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th>
          <th>Name</th>
          <th>Age</th>
          <th>Breed</th>
          <th>Zip Code</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr v-for="dog in props.dogs" :key="dog.id">
          <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th>
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                  <img :src="dog.img" :alt="`picture of ${dog.name}`" />
                </div>
              </div>
              <div>
                <div class="font-bold">{{ dog.name }}</div>
                <div class="text-sm opacity-50">United States</div>
              </div>
            </div>
          </td>
          <td>
            {{ dog.age }}
          </td>
          <td>{{ dog.breed }}</td>
          <td>
            {{ dog.zip_code }}
          </td>
        </tr>
      </tbody>
      <!-- foot -->
      <tfoot>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Job</th>
          <th>Favorite Color</th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
  import type { Dog } from '~/shared/types'
  interface Props {
    dogs: Dog[]
  }

  const props = defineProps<Props>()
</script>

<style></style>
