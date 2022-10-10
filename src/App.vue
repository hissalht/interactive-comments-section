<script lang="ts" setup>
import Comment from "./components/Comment.vue";

import data from "./assets/data.json";
import { IComment } from "./types";
import CommentTree from "./components/CommentTree.vue";

const comments = data.comments as IComment[];
</script>

<template>
  <div class="container">
    <CommentTree
      v-for="comment in comments"
      :key="comment.id"
      :root-comment="comment"
    />
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
