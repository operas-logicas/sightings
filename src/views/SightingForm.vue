<template>
  <fatal-error v-if="error" />
  <div v-else class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Add Sighting
      </p>
      <button @click="$emit('closeModal')" class="delete" aria-label="close"></button>
    </header>

    <section class="modal-card-body pb-3">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            class="input"
            type="text"
            name="title"
            placeholder="Close encounter in..."
            v-model="title"
            :class="[
              { 'is-danger': validateErrors('title') }
            ]"
          >
        </div>
        <p v-if="!validateErrors('title')" class="help">
          Enter a title for the sighting
        </p>
        <v-errors
          v-if="validateErrors('title')"
          :errors="validateErrors('title')"
        ></v-errors>
      </div>

      <div class="field">
        <label class="label">Date</label>
        <div class="control">
          <input
            class="input"
            type="date"
            name="date"
            v-model="date"
            :class="[
              { 'is-danger': validateErrors('date') }
            ]"
          >
        </div>
        <p v-if="!validateErrors('date')" class="help">
          Enter the date of the event
        </p>
        <v-errors
          v-if="validateErrors('date')"
          :errors="validateErrors('date')"
        ></v-errors>
      </div>

      <div class="field">
        <label class="label">GPS Coordinates</label>
        <div class="control is-flex is-invalid">
          <input
            class="input mr-2"
            type="text"
            name="location.latitude"
            placeholder="Latitude"
            v-model="coords[0]"
            :class="[
              { 'is-danger': validateErrors('location') }
            ]"
            disabled
          >
          <input
            class="input ml-2"
            type="text"
            name="location.longitude"
            placeholder="Longitude"
            v-model="coords[1]"
            :class="[
              { 'is-danger': validateErrors('location') }
            ]"
            disabled
          >
        </div>
        <p v-if="!validateErrors('location')" class="help">
          Latitude and longitude where the event occurred
          <i>(current position selected on map)</i>
        </p>
        <v-errors
          v-if="validateErrors('location')"
          :errors="validateErrors('location')"
        ></v-errors>
      </div>

      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <textarea
            class="textarea"
            name="description"
            placeholder="Tell us what happened..."
            v-model="description"
            :class="[
              { 'is-danger': validateErrors('description') }
            ]"
          ></textarea>
        </div>
        <p v-if="!validateErrors('description')" class="help">
          Describe what happened
        </p>
        <v-errors
          v-if="validateErrors('description')"
          :errors="validateErrors('description')"
        ></v-errors>
      </div>

      <div class="field pb-3">
        <label class="label">Upload Image</label>
        <div class="control">
          <div
            class="file"
            :class="[
              { 'is-danger': validateErrors('image') }
            ]"
          >
            <label class="file-label">
              <input
                @change="uploadFile"
                class="file-input"
                type="file"
                name="image"
              >

              <span class="file-cta">
                <span class="file-icon">⇪</span>
                <span class="file-label">Upload image...</span>
              </span>

              <span class="help pl-4"><i>{{ imageFileName }}</i></span>
            </label>
          </div>
        </div>
        <p v-if="!validateErrors('image')" class="help">
          Upload an image of the event
        </p>
        <v-errors
          v-if="validateErrors('image')"
          :errors="validateErrors('image')"
        ></v-errors>
      </div>
    </section>

    <footer class="modal-card-foot">
      <button
        @click.prevent="submit"
        class="button is-success"
        :disabled="sending"
      >Submit</button>

      <button
        @click="$emit('closeModal')"
        class="button"
        :disabled="sending"
      >Cancel</button>

      <p v-if="sending" class="i">Sending...</p>
    </footer>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import http from '../services/HttpService'

interface Error {
  title?: string[];
  date?: string[];
  description?: string[];
  image?: string[];
  coords?: string[];
  currentState?: string[];
}

export default defineComponent({
  setup(props, { emit }) {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      title: '',
      date: '',
      description: '',
      image: null as unknown as File,
      imageFileName: '',
      coords: [
        store.state.currentPosition[0],
        store.state.currentPosition[1]
      ] as number[],
      errors: null as unknown as Error,
      sending: false,
      error: false,
    })

    function validateErrors(field: keyof typeof state.errors) {
      return state.errors && state.errors[field] ? state.errors[field] : null
    }

    function uploadFile(event: Event) {
      const element = event.target as HTMLInputElement
      state.imageFileName = element.files && element.files[0]
        ? element.files[0].name
        : ''
      state.image = element.files && element.files[0]
        ? element.files[0]
        : null as unknown as File
    }

    async function submit() {
      state.sending = true
      state.errors = null as unknown as Error

      // Check if still logged in (auth token not expired)
      await store.dispatch('authenticate')
      const isLoggedIn = computed((): boolean => store.state.isLoggedIn)
      if (!isLoggedIn.value) {
        router.push({ name: 'login' })
        return
      }

      // Get current selected state from store
      const currentState = computed((): string => store.state.currentState)

      // Submit form data
      const formData = new FormData()
      if (state.title) formData.append('title', state.title)
      if (state.date) formData.append('date', moment.utc(state.date).format('YYYY-MM-DD'))
      if (state.description) formData.append('description', state.description)
      if (state.coords && state.coords[0] && state.coords[1])
        formData.append('location', state.coords.join(','))
      if (currentState.value) formData.append('state', currentState.value)
      if (state.image) formData.append('image', state.image)

      try {
        const response = await http().post(
          `/sightings`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )

        // Success
        if (response.status === 201) {
          state.sending = false

          // Push new sighting to global store
          // (will trigger top sightings to update)
          const sighting = response.data.data
          store.commit('setSighting', sighting)

          // Close modal
          emit('closeModal')

          // Redirect to new sighting
          await router.push({
            name: 'sighting',
            params: {
              id: sighting._id
            }
          })
        }

      } catch (error) {
        // Form errors from request validation
        if (
          error.response
          && error.response.status
          && error.response.status === 422
        )
          state.errors = error.response.data.errors

        // Not logged in (auth token expired)
        else if (
          error.response
          && error.response.status
          && error.response.status === 403
        )
          await router.push({ name: 'login' })

        // Fatal server error
        else state.error = true

      } finally {
        state.sending = false
      }
    }

    watch(
      () => store.state.currentPosition,
      () => {
        state.coords = [
          store.state.currentPosition[0],
          store.state.currentPosition[1]
        ]
      }
    )

    return {
      ...toRefs(state),
      validateErrors,
      uploadFile,
      submit
    }
  }
})
</script>
