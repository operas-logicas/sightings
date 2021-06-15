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
        <v-errors :errors="validateErrors('title')"></v-errors>
      </div>

      <div class="field">
        <label class="label">Date</label>
        <div class="control">
          <input
            class="input"
            type="text"
            name="date"
            placeholder="YYYY-MM-DD"
            v-model="date"
            :class="[
              { 'is-danger': validateErrors('date') }
            ]"
          >
        </div>
        <p v-if="!validateErrors('date')" class="help">
          Enter the date of the event <i>(Format: YYYY-MM-DD)</i>
        </p>
        <v-errors :errors="validateErrors('date')"></v-errors>
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
          >
        </div>
        <p v-if="!validateErrors('location')" class="help">
          Enter latitude and longitude where the event ocurred
          <i>(current position on map shown by default)</i>
        </p>
        <v-errors :errors="validateErrors('location')"></v-errors>
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
        <v-errors :errors="validateErrors('description')"></v-errors>
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
            </label>
          </div>
        </div>
        <p v-if="!validateErrors('image')" class="help">
          Upload an image of the event
        </p>
        <v-errors :errors="validateErrors('image')"></v-errors>
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
import axios from 'axios'
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as Auth from '../shared/auth'
import getCurrentState from '../shared/getCurrentState'

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

    if (!Auth.isLoggedIn()) {
      emit('closeModal')
      router.push({ name: 'login' })
    }

    const state = reactive({
      title: '',
      date: '',
      description: '',
      image: null as unknown as File,
      coords: [
        store.state.currentPosition[0],
        store.state.currentPosition[1]
      ] as number[],
      currentState: '',
      errors: null as unknown as Error,
      sending: false,
      error: false,
    })

    function validateErrors(field: keyof typeof state.errors) {
      return state.errors && state.errors[field] ? state.errors[field] : null
    }

    function uploadFile(event: Event) {
      const element = event.target as HTMLInputElement
      state.image = element.files && element.files[0]
        ? element.files[0]
        : null as unknown as File
    }

    async function submit() {
      state.sending = true
      state.errors = null as unknown as Error

      try {
        state.currentState = await getCurrentState(state.coords)
      } catch (error) {
        console.log('Could not get your current state from OpenCage Geocoding API')
        state.error = true
      } finally {
        state.sending = false
      }

      const formData = new FormData()
      if (state.title) formData.append('title', state.title)
      if (state.date) formData.append('date', state.date)
      if (state.description) formData.append('description', state.description)
      if (state.coords && state.coords[0] && state.coords[1])
        formData.append('location', state.coords.join(','))
      if (state.currentState) formData.append('state', state.currentState)
      if (state.image) formData.append('image', state.image)

      try {
        // Initialize CSRF Protection
        await axios.get(`/sanctum/csrf-cookie`)

        const response = await axios.post(
          `/api/sightings`,
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
              id: sighting.id
            }
          })
        }

      } catch (error) {
        if (error.response && error.response.status && error.response.status === 422)
          state.errors = error.response.data.errors
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
