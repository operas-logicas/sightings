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
            v-model="user.handle"
            :class="[
              { 'is-danger': validateErrors('handle') }
            ]"
          >
        </div>
        <v-errors
          v-if="validateErrors('handle')"
          :errors="validateErrors('handle')"
        ></v-errors>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input
            class="input"
            type="password"
            name="password"
            placeholder="Enter your password"
            v-model="user.password"
            :class="[
              { 'is-danger': validateErrors('password') }
            ]"
          >
        </div>
        <v-errors
          v-if="validateErrors('password')"
          :errors="validateErrors('password')"
        ></v-errors>
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
import { defineComponent, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '../../services/AuthService'

interface Error {
  handle?: string[];
  password?: string[];
}

export default defineComponent({
  setup(props, { emit }) {
    const router = useRouter()

    const state = reactive({
      user: {
        handle: '',
        password: ''
      },
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
        // Login user
        await Auth.login(state.user)
        
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
