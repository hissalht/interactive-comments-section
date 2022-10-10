<script lang="ts" setup>
import Comment from "./components/Comment.vue";

import data from "./assets/data.json";
import { IComment } from "./types";

const comments = data.comments as IComment[];
</script>

<template>
  <div class="container">
    <Comment v-for="comment in comments" :key="comment.id" :data="comment" />
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
