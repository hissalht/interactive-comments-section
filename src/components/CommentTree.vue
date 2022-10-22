<script lang="ts" setup>
import { nextTick, ref } from "vue";
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

const replyFormRef = ref<InstanceType<typeof CommentForm>>();

async function onReply(replyComment: IComment) {
  replyingTo.value = replyComment.user.username;
  showReplyForm.value = true;

  await nextTick();

  (replyFormRef.value?.$el as HTMLFormElement).scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  (replyFormRef.value?.$el as HTMLFormElement)
    .querySelector("textarea")
    ?.focus({ preventScroll: true });
}
</script>

<template>
  <div class="comment-tree">
    <Comment :data="rootComment" @reply="onReply(rootComment)" />
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
        @reply="onReply(replyComment)"
      />

      <CommentForm
        v-if="showReplyForm"
        class="reply-form"
        :replying-to="replyingTo"
        @submit="store.postReply($event, rootComment.id)"
        ref="replyFormRef"
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
