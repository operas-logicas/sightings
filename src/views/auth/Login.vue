<template>
  <fatal-error v-if="error" />
  <div v-else class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Login
      </p>
      <button @click="$emit('closeModal')" class="delete" aria-label="close"></button>
    </header>

    <section class="modal-card-body pb-3">
      <div class="field">
        <label class="label">User Handle</label>
        <div class="control">
          <input
            class="input"
            type="text"
            name="handle"
            placeholder="Enter your user handle"
            v-model="handle"
            :class="[
              { 'is-danger': validateErrors('handle') }
            ]"
          >
        </div>
        <v-errors :errors="validateErrors('handle')"></v-errors>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input
            class="input"
            type="password"
            name="password"
            placeholder="Enter your password"
            v-model="password"
            :class="[
              { 'is-danger': validateErrors('password') }
            ]"
          >
        </div>
        <v-errors :errors="validateErrors('password')"></v-errors>
      </div>

      <div>
        No account yet?
        <router-link :to="{ name: 'register' }">Register</router-link>
      </div>
    </section>

    <footer class="modal-card-foot">
      <button
        @click.prevent="login"
        class="button is-success"
        :disabled="sending"
      >Login</button>

      <button
        @click="$emit('closeModal')"
        class="button"
        :disabled="sending"
      >Cancel</button>

      <p v-if="sending" class="i">Logging in...</p>
    </footer>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as Auth from '../../shared/auth'

interface Error {
  handle?: string[];
  password?: string[];
}

export default defineComponent({
  setup(props, { emit }) {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      handle: '',
      password: '',
      errors: null as unknown as Error,
      sending: false,
      error: false
    })

    function validateErrors(field: keyof typeof state.errors) {
      return state.errors && state.errors[field] ? state.errors[field] : null
    }

    async function login() {
      state.sending = true
      state.errors = null as unknown as Error

      try {
        // Initialize CSRF Protection
        await axios.get(`/sanctum/csrf-cookie`)

        await axios.post(
          `/login`,
          {
            handle: state.handle,
            password: state.password
          }
        )

        // Login user:
        // - Set logged in status in browser local storage
        // - Load authenticated user from server
        // - Store user and logged in status in global store
        Auth.logIn()
        await store.dispatch('loadUser')

        state.sending = false

        // Close modal
        emit('closeModal')

        // Redirect home
        await router.push({ name: 'home' })

      } catch (error) {
        if (error.response && error.response.status && error.response.status === 422)
          state.errors = error.response.data.errors
        else state.error = true

      } finally {
        state.sending = false
      }
    }

    return {
      ...toRefs(state),
      validateErrors,
      login
    }
  }
})
</script>
