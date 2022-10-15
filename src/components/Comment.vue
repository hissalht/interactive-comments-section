<script lang="ts" setup>
import { propsToAttrMap } from "@vue/shared";
import { computed } from "vue";
import { useStore } from "../store";
import { IComment } from "../types";
import CommentScore from "./CommentScore.vue";

const props = defineProps<{
  data: IComment;
}>();

const store = useStore();

const isDownvoted = computed(() => store.downvotes.includes(props.data.id));
const isUpvoted = computed(() => store.upvotes.includes(props.data.id));
const totalScore = computed(
  () =>
    props.data.score + (isDownvoted.value ? -1 : 0) + (isUpvoted.value ? +1 : 0)
);
</script>

<template>
  <div class="comment">
    <CommentScore
      class="score"
      :score="totalScore"
      :upvoted="store.upvotes.includes(data.id)"
      :downvoted="store.downvotes.includes(data.id)"
      @downvote="store.downvote(data.id)"
      @upvote="store.upvote(data.id)"
      @reset="store.resetVote(data.id)"
    />
    <img
      class="avatar"
      :src="data.user.image.png"
      alt=""
      width="32"
      height="32"
    />
    <p class="username">
      {{ data.user.username }}
      <span
        v-if="store.currentUser.username === data.user.username"
        class="current-user"
      >
        <span class="sr-only">This is</span>
        you
      </span>
    </p>
    <p class="created-at">{{ data.createdAt }}</p>
    <div class="actions">
      <button class="reply-button">
        <svg
          aria-hidden="true"
          width="14"
          height="13"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
            fill="#5357B6"
          />
        </svg>
        Reply
      </button>
    </div>
    <p class="content">
      <span v-if="data.replyingTo" class="replying-to">
        @{{ data.replyingTo }}
      </span>
      {{ data.content }}
    </p>
  </div>
</template>

<style scoped>
.comment {
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: 8px;

  display: grid;
  grid-template-columns: auto auto auto auto 1fr auto;
  grid-template-rows: min-content 1fr;
  gap: 1rem;
  align-items: center;
}

.score {
  grid-row: 1 / -1;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.username,
.created-at,
.content {
  margin: 0;
}

.username {
  font-weight: 500;
  color: var(--dark-blue);
}

.username .current-user {
  background-color: var(--moderate-blue);
  color: var(--white);
  font-weight: 400;
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  margin-left: 0.25rem;
  border-radius: 2px;
}

.created-at {
  color: var(--grayish-blue);
}

.actions {
  grid-column: -2 / -1;
}

.reply-button {
  border: none;
  background: none;
  color: var(--moderate-blue);
  font-weight: 500;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: 0.4rem;
}

.replying-to {
  color: var(--moderate-blue);
  font-weight: 500;
}

.content {
  color: var(--grayish-blue);
  grid-row: 2;
  grid-column: 2 / -1;
  align-self: start;
}
</style>
