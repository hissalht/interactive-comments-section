<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
}>();

const dialogRef = ref<HTMLDialogElement>();

watch(
  () => props.show,
  (show) => {
    if (show) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" class="modal">
      <slot />
    </dialog>
  </Teleport>
</template>

<style scoped>
.modal {
  padding: 2rem;
  border: none;
  border-radius: 8px;
  max-width: 25rem;
}

.modal::backdrop {
  background-color: #0007;
}
</style>
