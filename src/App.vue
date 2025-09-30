<script lang="ts" setup>
import CommentTree from "./components/CommentTree.vue";
import { useStore } from "./store";
import CommentForm from "./components/CommentForm.vue";

const store = useStore();
</script>

<template>
  <main>
    <h1>Interactive comment section</h1>
    <TransitionGroup tag="div" class="container" name="comment-list">
      <CommentTree
        v-for="comment in store.comments"
        :key="comment.id"
        :root-comment="comment"
      />
      <CommentForm key="comment-form" @submit="store.postComment($event)" />
    </TransitionGroup>
  </main>
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
</style>
