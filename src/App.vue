<script lang="ts" setup>
import CommentTree from "./components/CommentTree.vue";
import { useStore } from "./store";
import CommentForm from "./components/CommentForm.vue";

const store = useStore();
</script>

<template>
  <TransitionGroup tag="div" class="container" name="comment-list">
    <CommentTree
      v-for="comment in store.comments"
      :key="comment.id"
      :root-comment="comment"
    />
    <CommentForm />
  </TransitionGroup>
</template>

<style scoped>
.container {
  max-width: 48rem;
  margin: auto;
  padding: 4rem 1rem;
}

.container > * + * {
  margin-top: 20px;
}

.comment-list-move,
.comment-list-enter-active,
.comment-list-leave-active {
  transition: all 0.5s ease;
}

.comment-list-enter-from {
  scale: 0.8;
  opacity: 0;
}
</style>
