<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
}>();

const dialogRef = ref<HTMLDialogElement>();
const addVisibleClass = ref(false);

watch(
  () => props.show,
  (show) => {
    if (show) {
      dialogRef.value?.showModal();
      addVisibleClass.value = true;
    } else {
      addVisibleClass.value = false;
      dialogRef.value?.addEventListener(
        "transitionend",
        () => {
          dialogRef.value?.close();
        },
        { once: true }
      );
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" class="modal" :class="{ visible: addVisibleClass }">
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

  transition: all 0.25s ease-out;

  scale: 0.5;
  opacity: 0;
}

.modal.visible {
  scale: 1;
  opacity: 1;
}

.modal::backdrop {
  background-color: #0000;
  /* 
  Backdrop transition does not work on Firefox, works fine on Chromium
  tested on Firefox Developer Edition 107.0b2 (64-bit)
  */
  transition: all 0.5s ease-out;
}

.modal.visible::backdrop {
  background-color: #0007;
}
</style>
