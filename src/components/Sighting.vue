<template>
  <article class="content is-small box">
    <div>
      <p class="is-size-6 is-flex is-justify-content-space-between">
        <span class="truncate horiz mb-1">{{ sighting.title }}</span>
        <span>
          <span v-if="hasLikes" class="is-clickable">💚</span>
          <span v-else class="is-clickable">🤍</span> {{ sighting.likes }}
        </span>
      </p>
    </div>
    <p>
      <span class="is-size-6 mb-1 pr-1" v-html="svg"></span>
      {{ sighting.user_handle }} &bull; {{ niceDate }}
    </p>
    <p class="truncate">{{ sighting.description }}</p>
  </article>
</template>

<script lang="ts">
import moment from 'moment'
import { computed, defineComponent, PropType } from 'vue'
import { createAvatar } from '@dicebear/avatars'
import * as style from '@dicebear/avatars-identicon-sprites'

export default defineComponent({
  props: {
    sighting: {
      // eslint-disable-next-line no-undef
      type: Object as PropType<Sighting>,
      required: true
    }
  },

  setup(props) {
    const hasLikes = computed(
      () => props.sighting.likes > 0
    )

    const niceDate = computed(
      () => moment(props.sighting.date).format('ll')
    )

    const svg = computed(
      () => createAvatar(style, {
        seed: props.sighting.user_handle,
        width: 20,
        height: 20,
        backgroundColor: 'lightGreen',
        colorLevel: 400    
      })
    )

    return {
      hasLikes,
      niceDate,
      svg
    }
  }
})
</script>

<style scoped>
.truncate {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.horiz {
  width: 80%;
  -webkit-line-clamp: 1 !important;
}
</style>
