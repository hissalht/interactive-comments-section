<script lang="ts" setup>
import Modal from "./Modal.vue";

defineProps<{
  show: boolean;
}>();

defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <Modal :show="show">
    <div class="modal-content">
      <p class="modal-header">Delete comment</p>
      <div class="modal-body">
        <p>
          Are you sure you want to delete this comment ? This will remove the
          comment and cannot be undone.
        </p>
      </div>
      <div class="modal-actions">
        <button class="cancel-button" @click="$emit('cancel')">
          No, cancel
        </button>
        <button class="confirm-button" @click="$emit('confirm')">
          Yes, delete
        </button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.modal-content {
  display: grid;
  grid-auto-flow: row;
  gap: 1rem;
}

.modal-header {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--dark-blue);
  margin: 0;
}

.modal-body {
  color: var(--grayish-blue);
  line-height: 1.5;
}

.modal-body p {
  margin: 0;
}

.modal-actions {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
}

.confirm-button,
.cancel-button {
  padding: 1rem;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--white);
  border: none;
  border-radius: 6px;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
}

.confirm-button {
  background-color: var(--soft-red);
}
.cancel-button {
  background-color: var(--grayish-blue);
}
</style>
