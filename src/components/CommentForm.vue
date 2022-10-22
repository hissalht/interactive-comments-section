<script lang="ts" setup>
import { ref, watch } from "vue";
import { useStore } from "../store";
import { getUniqueId } from "../utils";

const props = defineProps<{
  replyingTo?: string;
}>();

const emit = defineEmits<{
  (e: "submit", content: string): void;
}>();

const store = useStore();
const uniqueId = getUniqueId();

const contentValue = ref("");

function handleSubmit() {
  emit("submit", contentValue.value);
  contentValue.value = "";
}

// update the mention tag at the start of the comment.
// ex: "@some_user Blah blah blah..."
watch(
  () => props.replyingTo,
  (replyingTo) => {
    const regex = /^@\w+ /;
    let newContent = contentValue.value.replace(regex, "");
    if (replyingTo) {
      newContent = `@${replyingTo} ${newContent}`;
    }
    contentValue.value = newContent;
  },
  { immediate: true }
);
</script>

<template>
  <form class="comment-form" @submit.prevent="handleSubmit">
    <img
      class="avatar"
      :src="store.currentUser.image.png"
      alt=""
      width="32"
      height="32"
    />

    <label :for="'comment-input-' + uniqueId" class="sr-only">
      Add a comment
    </label>
    <textarea
      :id="'comment-input-' + uniqueId"
      class="content-field"
      placeholder="Add a comment"
      required
      v-model="contentValue"
      rows="5"
    />

    <div>
      <!-- TODO: check a11y label -->
      <button class="submit-button" type="submit">Send</button>
    </div>
  </form>
</template>

<style scoped>
.comment-form {
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: 8px;

  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
}

.content-field {
  border-radius: 8px;
  border: 1px solid var(--light-gray);
  padding: 0.75rem 1.25rem;
  font-family: inherit;
  resize: vertical;
}

.content-field:hover {
  border-color: var(--moderate-blue);
}

.submit-button {
  background-color: var(--moderate-blue);
  color: var(--white);
  border: none;
  text-transform: uppercase;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.submit-button:hover {
  background-color: var(--light-grayish-blue);
}
</style>
