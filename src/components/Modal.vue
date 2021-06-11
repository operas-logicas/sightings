<template>
  <div
    class="modal"
    :class="[
      { 'is-active': show }
    ]"
  >
    <div @click="$emit('closeModal')" class="modal-background"></div>

    <!-- Views -->
    <login @closeModal="$emit('closeModal')" v-if="modal === 'login'" />
    <register @closeModal="$emit('closeModal')" v-else-if="modal === 'register'" />
    <sighting-form @closeModal="$emit('closeModal')" v-else-if="modal === 'post'" />
    <sighting-detail @closeModal="$emit('closeModal')" v-else-if="modal === 'sighting'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import SightingForm from '../views/SightingForm.vue'
import SightingDetail from '../views/SightingDetail.vue'

export default defineComponent({
  components: {
    'login': Login,
    'register': Register,
    'sighting-form': SightingForm,
    'sighting-detail': SightingDetail
  },

  props: {
    show: Boolean,
    modal: String
  }
})
</script>

<style scoped>
.is-active {
  display: flex;
  z-index: 1000;
}
</style>
