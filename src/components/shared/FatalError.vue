<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Error!
      </p>
      <button @click="$emit('closeModal')" class="delete" aria-label="close"></button>
    </header>

    <section class="modal-card-body pb-3">
      <div>
        <p class="is-size-4">We've encountered a problem 💣</p>
        <p class="is-size-5 mt-4 mb-3">Unfortunately we cannot proceed</p>
      </div>
    </section>

    <footer class="modal-card-foot">
      <button
        @click="$emit('closeModal')"
        class="button"
      >Close</button>
    </footer>
  </div>

</template>
