<template>
  <div class="sighting-map column is-three-fifths-tablet is-two-thirds-desktop">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">
      <p class="is-size-4 mt-3">Error!</p>
      <hr>
      <p class="is-size-4">We've encountered a problem 💣</p>
      <p class="is-size-5 mt-4 mb-3">Unfortunately we cannot proceed</p>
    </div>
    <l-map
      v-else
      ref="map"
      @click="renderMap"
      :zoom="zoom"
      :center="coords"
      :options="mapOptions"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />

      <!-- Sightings -->
      <l-marker
        v-for="(sighting, i) in sightings"
        :key="`marker-${i}`"
        :lat-lng="sighting.location.split(',')"
      >
        <l-popup>
          <router-link :to="{ name: 'sighting', params: { id: sighting.id } }">
            <sighting :sighting="sighting" />
          </router-link>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import Sighting from './Sighting.vue'
import formatCoords from '../shared/formatCoords'
import getCurrentState from '../shared/getCurrentState'

type Position = {
  coords?: {
    latitude: number;
    longitude: number
  },
  latlng?: {
    lat: number;
    lng: number
  }
}

export default defineComponent({
  components: {
    Sighting,
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },

  setup() {
    const store = useStore()

    const state = reactive({
      zoom: 7,
      coords: [0, 0],
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        scrollWheelZoom: false
      },
      sightings: [] as Sighting[],
      currentState: '',
      loading: true,
      error: false
    })

    async function renderMap(position: Position): Promise<void> {
      if (position.coords) {
        // Geolocation position
        const { latitude, longitude } = position.coords
        state.coords = formatCoords(latitude, longitude)
      } else if (position.latlng) {
        // Map click event
        const { lat, lng } = position.latlng
        state.coords = formatCoords(lat, lng)
      } else return

      // Update the store
      store.commit('setCurrentPosition', state.coords)

      try {
        state.currentState = await getCurrentState(state.coords)
      } catch (error) {
        console.log('Could not get your current state from OpenCage Geocoding API')
        state.error = true
      } finally {
        state.loading = false
      }
    }

    async function getSightings() {
      try {
        state.sightings =
          (await axios.get(
            `/api/sightings?state=${state.currentState}`)
          ).data.data

        // Save to store
        store.commit('setSightings', state.sightings)

      } catch (error) {
        state.error = true
      } finally {
        state.loading = false
      }
    }

    // 'onCreated' get current position and load map
    (async () => {
      if (navigator.geolocation)
        await navigator.geolocation.getCurrentPosition(
          // Success
          renderMap,

          // Error
          () => {
            alert('Could not get your position.')
          }
        )
    })()

    // When we get the current state from position,
    // or a new sighting is pushed to the global store,
    // refresh sightings from server
    watch(
      () => state.currentState,
      getSightings
    )

    return {
      ...toRefs(state),
      renderMap
    }
  }
})
</script>

<style>
.sighting-map {
  height: 800px;
}

.leaflet-popup-content {
  margin: 0 !important;
  width: 320px !important;
}
</style>
