<template>
  <section class="hero is-medium is-black">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <span
              class="navbar-burger is-white"
              data-target="navbarMenuHero"
              @click="toggleNavbarMenu"
              :class="[
                { 'is-active': navbarMenu }
              ]"
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>

          <div
            id="navbarMenuHero"
            class="navbar-menu"
            :class="[
              { 'is-active': navbarMenu }
            ]"
          >
            <div class="navbar-end">
              <router-link :to="{ name: 'home' }" class="navbar-item">
                Home
              </router-link>
              <router-link v-if="isLoggedIn" :to="{ name: 'post' }" class="navbar-item">
                Post
              </router-link>
              <router-link v-if="!isLoggedIn" :to="{ name: 'register' }" class="navbar-item">
                Register
              </router-link>
              <router-link v-if="!isLoggedIn" :to="{ name: 'login' }" class="navbar-item">
                Login
              </router-link>
              <a v-if="isLoggedIn" @click.prevent="logout" href="#" class="navbar-item">
                Logout
              </a>
              <a v-if="isLoggedIn" href="#" class="navbar-item is-disabled">
                <strong>User:&nbsp;</strong>
                {{ userHandle }}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div class="container has-text-centered">
        <p class="title is-1">
          Encounters!
        </p>
        <p class="subtitle is-4">
          UFO Sightings
        </p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="columns">
      <sighting-list @showModal="showModal" />
      <map-view @showModal="showModal" />
    </div>
  </section>

  <modal @closeModal="closeModal" :show="show" :modal="view" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import { useRouter, useRoute, RouteRecordName } from 'vue-router'
import { useStore } from 'vuex'
import Map from './components/Map.vue'
import Modal from './components/Modal.vue'
import SightingList from './components/SightingList.vue'
import Auth from './services/AuthService'

export default defineComponent({
  components: {
    'map-view': Map,
    'modal': Modal,
    'sighting-list': SightingList
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      navbarMenu: false,
      show: false,
      view: 'home' as RouteRecordName | null | undefined
    })

    const isLoggedIn = computed((): boolean => store.state.isLoggedIn)
    const userHandle = computed((): string => store.state.user.handle)

    function logout() {
      try {
        Auth.logout()
        store.dispatch('authenticate')
      } catch (error) {
        Auth.logout()
        store.dispatch('authenticate')
      }
    }

    function toggleNavbarMenu() {
      state.navbarMenu = !state.navbarMenu
    }

    function showModal(name: RouteRecordName) {
      router.push({ name })
    }

    function closeModal() {
      state.show = false
      state.view = 'home'
      router.push({
        name: 'home'
      })
    }

    watch(
      () => route.name,
      name => {
        if (name === 'home') return
        state.view = name
        state.show = true
      }
    )

    return {
      ...toRefs(state),
      isLoggedIn,
      userHandle,
      logout,
      toggleNavbarMenu,
      showModal,
      closeModal
    }
  }
})
</script>

<style scoped>
.columns {
  height: auto;
}

.hero {
  background-image: url("../src/assets/images/ufo-green-hero.jpg");
  background-position: top left;
  background-size: cover;
}

.navbar-burger {
  color: white;
}

.navbar-item:hover {
  background-color: hsl(0, 0%, 21%) !important;
}

.navbar-item:focus {
  background-color: black !important;
}

.navbar-item.is-active:hover {
  background-color: black !important;
}

.navbar-item.is-disabled:focus {
  background-color: inherit !important;
  cursor: text !important;
}

.navbar-item.is-disabled:hover {
  background-color: inherit !important;
  cursor: text !important;
}
</style>
