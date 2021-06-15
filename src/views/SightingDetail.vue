<template>
  <div v-if="sighting" class="modal-card">
    <header class="modal-card-head pb-2">
      <p class="modal-card-title is-flex-shrink-1">
        {{ sighting.title }}
        <span class="is-block is-size-6 mt-1">(GPS: {{ sighting.location }})</span>
        <span class="is-block is-size-6 mt-4 mb-0">
          <span class="is-size-5">👽</span>
          {{ sighting.user_handle }} &bull; {{ niceDate }}
        </span>
      </p>
      <button @click="$emit('closeModal')" class="delete" aria-label="close"></button>
    </header>

    <section class="modal-card-body pb-3">
      <div class="content">
        <p v-if="sighting.img_path" class="image is-4by3 mb-3">
          <img :src="`../storage/${sighting.img_path}`">
        </p>
        <p class="mb-3">
          {{ sighting.description }}
        </p>
        <likes :sighting="sighting" :hasLikes="hasLikes" :likes="sighting.likes"></likes>
      </div>
    </section>

    <footer class="modal-card-foot">
      <button @click="$emit('closeModal')" class="button">Close</button>
    </footer>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import moment from 'moment'
import { defineComponent, reactive, toRefs, watch} from 'vue'
import { useRoute } from 'vue-router'
import Likes from '../components/Likes.vue'

export default defineComponent({
  components: {
    Likes
  },

  props: {
    id: String
  },

  setup() {
    const route = useRoute()

    const state = reactive({
      // eslint-disable-next-line no-undef
      sighting: null as unknown as Sighting,
      niceDate: '',
      hasLikes: false,
      loading: true
    });

    // 'onCreated' load sighting
    (async function() {
      try {
        state.sighting = (await axios.get(
          `/api/sightings/${route.params.id}`)
        ).data.data
      } catch (error) {
          console.log(error)
      } finally {
          state.loading = false
      }
    })()

    watch(
      () => state.sighting,
      () => {
        if (state.sighting) {
          state.hasLikes = state.sighting.likes > 0
          state.niceDate = moment(state.sighting.date).format('ll')
        }
      }
    )

    return {
      ...toRefs(state)
    }
  }
})
</script>
