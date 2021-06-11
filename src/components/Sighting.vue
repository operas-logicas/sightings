<template>
  <article class="content is-small box">
    <div>
      <p class="is-size-6 is-flex is-justify-content-space-between">
        <span class="truncate horiz">{{ sighting.title }}</span>
        <span>
          <span v-if="hasLikes" class="is-clickable">💚</span>
          <span v-else class="is-clickable">🤍</span> {{ sighting.likes }}
        </span>
      </p>
    </div>
    <p>
      <span class="is-size-6 mb-1">👽</span>
      {{ sighting.user_handle }} &bull; {{ niceDate }}
    </p>
    <p class="truncate">{{ sighting.description }}</p>
  </article>
</template>

<script lang="ts">
import moment from 'moment'
import { computed, defineComponent, PropType } from 'vue'

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

    return {
      hasLikes,
      niceDate
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
