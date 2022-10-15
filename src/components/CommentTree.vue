<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "../store";
import { IComment } from "../types";
import Comment from "./Comment.vue";
import CommentForm from "./CommentForm.vue";

defineProps<{
  rootComment: IComment;
}>();

const store = useStore();
const showReplyForm = ref(false);
const replyingTo = ref<string>();
</script>

<template>
  <div class="comment-tree">
    <Comment
      :data="rootComment"
      @reply="
        replyingTo = rootComment.user.username;
        showReplyForm = true;
      "
    />
    <TransitionGroup
      name="comment-list"
      tag="div"
      class="replies"
      :class="{ visible: showReplyForm || rootComment.replies.length }"
    >
      <Comment
        v-for="replyComment in rootComment.replies"
        :key="replyComment.id"
        class="reply-comment"
        :data="replyComment"
        @reply="
          replyingTo = replyComment.user.username;
          showReplyForm = true;
        "
      />

      <CommentForm
        v-if="showReplyForm"
        class="reply-form"
        :replying-to="replyingTo"
        @submit="store.postReply($event, rootComment.id)"
      />
    </TransitionGroup>
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

.reply-form.comment-list-enter-from {
  scale: 1;
}
</style>
