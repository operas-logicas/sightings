<template>
  <p
    class="help is-danger"
    v-for="(error, index) in errors"
    :key="key(index)"
  >{{ error }}</p>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    errors: {
      type: Array as PropType<string[]>,
      required: true
    }
  },

  setup() {
    function key(index: number): string {
      return `validation_error_${index}_${Math.random()}`
    }

    return {
      key
    }
  }
})
</script>
