<template>
  <div v-if="sighting" class="modal-card">
    <header class="modal-card-head pb-2">
      <p class="modal-card-title is-flex-shrink-1">
        {{ sighting.title }}
        <span class="is-block is-size-6 mt-1">(GPS: {{ sighting.location }})</span>
        <span class="is-block is-size-6 mt-4 mb-0">
          <span class="is-size-5 pr-1" v-html="svg"></span>
          {{ sighting.user_handle }} &bull; {{ niceDate }}
        </span>
      </p>
      <button @click="$emit('closeModal')" class="delete" aria-label="close"></button>
    </header>

    <section class="modal-card-body pb-3">
      <div class="content">
        <p v-if="sighting.img_path" class="image is-4by3 mb-3">
          <img :src="sighting.img_path">
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
import moment from 'moment'
import { computed, defineComponent, reactive, toRefs, watch} from 'vue'
import { useRoute } from 'vue-router'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-identicon-sprites'
import Likes from '../components/Likes.vue'
import http from '../services/HttpService'

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

    const niceDate = computed(
      () => moment.utc(state.sighting.date).format('ll')
    )

    const svg = computed(
      () => createAvatar(style, {
        seed: state.sighting.user_handle,
        width: 40,
        height: 40,
        backgroundColor: 'lightGreen',
        colorLevel: 400    
      })
    );

    // 'onCreated' load sighting
    (async function() {
      try {
        state.sighting = (await http().get(
          `/sightings/${route.params.id}`)
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
      ...toRefs(state),
      niceDate,
      svg
    }
  }
})
</script>
