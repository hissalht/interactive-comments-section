<script lang="ts" setup>
import { IComment } from "../types";
import Comment from "./Comment.vue";

defineProps<{
  rootComment: IComment;
}>();
</script>

<template>
  <div class="comment-tree">
    <Comment :data="rootComment" />
    <div class="replies" v-if="rootComment.replies.length">
      <Comment
        v-for="replyComment in rootComment.replies"
        :key="replyComment.id"
        class="reply-comment"
        :data="replyComment"
      />
    </div>
  </div>
</template>

<style scope>
.comment-tree > * + *,
.replies > * + * {
  margin-top: 1.25rem;
}

.replies {
  border-left: 2px solid var(--light-gray);
  padding-left: 40px;
  margin-left: 40px;
}
</style>
