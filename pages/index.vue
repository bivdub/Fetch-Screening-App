<template>
  <div class="container w-full mx-auto py-10">
    <h1 class="text-center text-4xl">DogFindr</h1>
    <div class="drawer pb-5">
      <input id="dog-drawer" type="checkbox" class="drawer-toggle" />
      <!-- TODO: Extract sidebar in to separate component -->
      <div class="drawer-side z-10">
        <label
          for="dog-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>

        <ul class="menu bg-base-200 text-base-content min-h-full w-100 p-4">
          <!-- Sidebar content here -->
          <Button
            :disabled="!finalDogsArray.length"
            @click="pickFinalDog"
            class="btn btn-primary mb-5"
          >
            Find Your New Dog!
          </Button>
          <li v-if="!finalDogsArray.length" class="pt-4 text-center text-xl">
            Select at least one dog on the table to enable final selection.
          </li>
          <li
            v-for="dog in finalDogsArray"
            :key="dog.id"
            class="menu-title flex flex-row justify-between items-center"
          >
            <img
              :src="dog.img"
              :alt="dog.img"
              class="rounded w-20 h-20 object-cover"
              width="100"
              height="100"
            />
            <p class="text-lg">{{ dog.name }}</p>
            <Button @click="deleteDog(dog)" class="btn btn-primary">
              Remove
            </Button>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="controls-container flex flex-row justify-between items-end py-5"
    >
      <div class="drawer-content flex align-right">
        <!-- Page content here -->
        <label for="dog-drawer" class="btn btn-primary drawer-button">
          Show Selected Dogs
        </label>
      </div>
      <div class="filters-container inline-flex items-end">
        <div class="mr-4">
          <label for="integeronly" class="font-bold block mb-2">
            Select Breeds
          </label>
          <MultiSelect
            v-if="breeds"
            v-model="selectedBreeds"
            display="chip"
            name="breeds"
            :options="breeds.data"
            filter
            placeholder="Select Breeds"
            class="min-w-60"
          />
        </div>

        <div class="w-20 mr-4">
          <label for="minimumage" class="font-bold block mb-2">Min. Age</label>
          <InputNumber
            v-model="minAge"
            showButtons
            inputId="minimumage"
            :min="0"
            :max="15"
            fluid
          />
        </div>
        <div class="w-20 mr-4">
          <label for="maximumage" class="font-bold block mb-2">Max. Age</label>
          <InputNumber
            v-model="maxAge"
            :invalid="maxAge < minAge && maxAge !== 0"
            :min="0"
            :maax="15"
            showButtons
            inputId="maximumage"
            fluid
          />
        </div>
        <div class="mr-4">
          <label for="city" class="font-bold block mb-2">City</label>
          <InputText v-model="searchCity" inputId="city" fluid />
        </div>
        <div class="mr-4 w-20">
          <label for="state" class="font-bold block mb-2">State</label>
          <Select
            v-model="searchState"
            inputId="state"
            :options="stateCodes"
            fluid
          />
        </div>
      </div>
      <div class="flex flex-col w-40 items-end">
        <div v-if="invalidMessage" class="text-sm text-error text-right">
          {{ invalidMessage }}
        </div>
        <Button
          @click="fetchDogs"
          :disabled="!isValidRequest"
          class="btn btn-primary w-20"
        >
          Search
        </Button>
      </div>
    </div>
    <div v-if="!totalDogs" class="text-4xl text-center pt-8">
      No matching dogs, try broadening your search criteria!
    </div>

    <DataTable
      v-if="selectedDogsInfo && totalDogs"
      v-model:selection="selectedDogs"
      :paginator="true"
      :totalRecords="totalDogs"
      :lazy="true"
      :first="firstItemOnPage"
      :value="selectedDogsInfo"
      :rows="PAGE_LIMIT"
      :sort-order="sortOrder"
      :sort-field="sortField"
      :loading="isLoading"
      @row-select-all="onRowSelectAll"
      @row-unselect-all="onRowUnselectAll"
      @row-select="onRowSelect"
      @row-unselect="onRowUnselect"
      @sort="handleSort"
      @page="handlePageChange"
      dataKey="id"
      tableStyle="min-width: 50rem"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport JumpToPageInput"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="img" header="" class="w-32">
        <template #body="slotProps">
          <div class="flex row items-center">
            <img
              :src="`${slotProps.data.img}`"
              :alt="slotProps.data.image"
              class="rounded w-20 h-20 object-cover"
              width="100"
              height="100"
            />
          </div>
        </template>
      </Column>
      <Column sortable field="name" header="Name"></Column>
      <Column sortable field="age" header="Age"></Column>
      <Column sortable field="breed" header="Category"></Column>
      <Column sortable field="zip_code" header="Zip Code"></Column>
    </DataTable>

    <!-- Final Selection Modal -->
    <div class="card flex justify-center">
      <Dialog
        v-model:visible="showFinalModal"
        modal
        :closable="false"
        :style="{ width: '25rem' }"
      >
        <div class="flex flex-col gap-y-3 justify-center">
          <p class="text-xl text-center">Your New Friend is:</p>
          <p class="text-2xl text-center">{{ finalDog.name }}!</p>
          <img :src="finalDog.img" :alt="finalDog.name" />
          <Button
            type="button"
            label="Not Feeling It? Try Again"
            @click="finalDog = undefined"
          ></Button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type {
    DataTablePageEvent,
    DataTableRowSelectAllEvent,
    DataTableRowSelectEvent,
    DataTableRowUnselectAllEvent,
    DataTableRowUnselectEvent,
    DataTableSortEvent
  } from 'primevue/datatable'
  import type { Dog, Location } from '~/shared/types'
  import { stateCodes } from '~/shared/states'

  import { useToast } from 'primevue/usetoast'

  definePageMeta({ middleware: ['auth'] })

  const toast = useToast()

  const dogsApi = useDogsApi()
  const locationApi = useLocationApi()

  const breeds = ref()
  const dogs: Ref<string[] | null> = ref(null)
  const selectedDogsInfo: Ref<Dog[] | null> = ref(null)
  const selectedDogs: Ref<Dog[]> = ref([])
  const selectedBreeds = ref([])
  const selectedZips = ref([])
  const finalDogs = ref(new Set<Dog>([]))
  const totalDogs = ref(0)
  const minAge = ref(0)
  const maxAge = ref(0)
  const searchState = ref()
  const searchCity = ref()
  const sortField = ref('breed')
  const sortOrder = ref(1)
  const firstItemOnPage = ref(0)
  const isLoading = ref(false)
  const finalDog = ref()
  const invalidMessage = ref('')

  const PAGE_LIMIT = 10

  // Initial content load
  breeds.value = await useFetch('api/dogs/breeds')
  let { result: dogIds } = await dogsApi.getIds({
    size: PAGE_LIMIT,
    sort: `${sortField.value}:${sortOrder.value === 1 ? 'asc' : 'desc'}`
  })
  dogs.value = dogIds?.resultIds as string[]
  totalDogs.value = dogIds?.total as number

  let { result: dogListDetails } = await dogsApi.getDogDetails(dogs.value)

  selectedDogsInfo.value = (dogListDetails as Dog[]) || null

  //Computed Values

  //validation for submit form
  const isValidRequest: Ref<boolean> = computed(() => {
    if (searchState.value && !searchCity.value) {
      invalidMessage.value = 'Please Enter a City'
      return false
    }

    if (maxAge.value !== 0 && maxAge.value < minAge.value) {
      invalidMessage.value = 'Max. Age can not be lower than Min. Age'
      return false
    }

    if (searchCity.value && !searchState.value) {
      invalidMessage.value = 'Please Enter a State'
      return false
    }

    invalidMessage.value = ''
    return true
  })

  const finalDogsArray = computed(() => {
    return Array.from(finalDogs.value)
  })

  const showFinalModal = computed(() => {
    return !!finalDog.value
  })

  // Local Data Change Functions
  const onRowSelect = (e: DataTableRowSelectEvent) => {
    finalDogs.value.add(e.data)
  }

  const onRowUnselect = (e: DataTableRowUnselectEvent) => {
    finalDogs.value.delete(e.data)
  }

  const onRowSelectAll = (e: DataTableRowSelectAllEvent) => {
    e.data.forEach((dog: Dog) => {
      finalDogs.value.add(dog)
    })
  }

  const onRowUnselectAll = (e: DataTableRowUnselectAllEvent) => {
    selectedDogsInfo.value?.forEach((dog: Dog) => {
      finalDogs.value.delete(dog)
    })
  }

  //TODO: FIX BUG WHERE CHECKBOX IS NOT UPDATING ON TABLE ON SIDEBAR DELETE
  const deleteDog = (dog: Dog) => {
    finalDogs.value.delete(dog)
  }

  // External API Call Functions
  const pickFinalDog = async () => {
    isLoading.value = true
    if (!finalDogsArray.value.length) {
      isLoading.value = false
      throw new Error('At Least One Dog Must Be Selected')
    }

    try {
      const { result } = await dogsApi.getFinalDog(
        finalDogsArray.value.map((d) => d.id)
      )
      finalDog.value = finalDogsArray.value.filter(
        (d) => d.id === result.match
      )[0]
    } catch (e) {
      console.log(e)
    }
    isLoading.value = false
  }

  const handleSort = async (e: DataTableSortEvent) => {
    const oldSortField = sortField.value
    const oldSortOrder = sortOrder.value

    sortField.value = e.sortField ? (e.sortField as string) : 'name'
    sortOrder.value = e.sortOrder ? e.sortOrder : 1

    if (oldSortField !== sortField.value || oldSortOrder !== sortOrder.value) {
      isLoading.value = true
      try {
        await fetchDogs()
      } catch (e) {
        sortField.value = oldSortField
        sortOrder.value = oldSortOrder
        console.log(e)
      }

      isLoading.value = false
    }
  }

  const handlePageChange = async (e: DataTablePageEvent) => {
    let oldFirstItem = firstItemOnPage.value
    firstItemOnPage.value = e.first

    if (oldFirstItem !== firstItemOnPage.value) {
      isLoading.value = true
      try {
        await fetchDogs()
      } catch (e) {
        firstItemOnPage.value = oldFirstItem
        console.log(e)
      }

      isLoading.value = false
    }
  }

  const fetchDogs = async () => {
    if (!isValidRequest.value) {
      throw new Error('Invalid Request')
    }

    if (searchCity.value && searchState.value) {
      const { result: locationResult } = await locationApi.getLocationDetails(
        searchCity.value,
        searchState.value
      )

      if (!locationResult.results) {
        throw new Error('Invalid Location')
      }

      selectedZips.value = locationResult.results.map(
        (r: Location) => r.zip_code
      )
    }

    let params: Record<string, any> = {
      size: PAGE_LIMIT,
      from: firstItemOnPage.value,
      sort: `${sortField.value}:${sortOrder.value === 1 ? 'asc' : 'desc'}`
    }

    if (selectedBreeds.value.length > 0) {
      params['breeds'] = selectedBreeds.value
    }

    if (minAge.value) {
      params['ageMin'] = minAge.value
    }

    if (maxAge.value) {
      params['ageMax'] = maxAge.value
      if (!params['ageMin']) {
        params['ageMin'] = 0
      }
    }

    if (searchCity.value && searchState.value) {
      params['city'] = searchCity.value
      params['state'] = searchState.value
    }

    if (selectedZips.value.length > 0) {
      params['zipCodes'] = selectedZips.value
    }

    const { result } = await dogsApi.getIds(params)

    dogs.value = result.resultIds as string[]
    totalDogs.value = result.total as number

    let { result: detailsResult } = await dogsApi.getDogDetails(dogs.value)

    selectedDogsInfo.value = (detailsResult as Dog[]) ?? null
  }
</script>

<style></style>
