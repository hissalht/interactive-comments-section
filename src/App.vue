<script lang="ts" setup>
import CommentTree from "./components/CommentTree.vue";
import { useStore } from "./store";
import CommentForm from "./components/CommentForm.vue";

const store = useStore();
</script>

<template>
  <div class="container">
    <CommentTree
      v-for="comment in store.comments"
      :key="comment.id"
      :root-comment="comment"
    />
    <CommentForm />
  </div>
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
