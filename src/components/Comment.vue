<script lang="ts" setup>
import { computed, ref } from "vue";
import { useStore } from "../store";
import { CommentStatus, IComment } from "../types";
import { getUniqueId } from "../utils";
import CommentScore from "./CommentScore.vue";

const props = defineProps<{
  data: IComment;
}>();

defineEmits<{
  (e: "reply"): void;
}>();

const store = useStore();

const isDownvoted = computed(() => store.downvotes.includes(props.data.id));
const isUpvoted = computed(() => store.upvotes.includes(props.data.id));
const totalScore = computed(
  () =>
    props.data.score + (isDownvoted.value ? -1 : 0) + (isUpvoted.value ? +1 : 0)
);
const isSending = computed(() => props.data.status !== CommentStatus.READY);
const isCurrentUser = computed(
  () => store.currentUser.username === props.data.user.username
);

const isUpdating = ref(false);
const fieldId = `comment-input-${getUniqueId()}`;
const contentValue = ref(props.data.content);

function updateComment() {
  store.updateComment(props.data.id, contentValue.value);
  isUpdating.value = false;
}
</script>

<template>
  <div class="comment" :class="{ sending: isSending }">
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
      <span v-if="isCurrentUser" class="current-user">
        <span class="sr-only">This is</span>
        you
      </span>
    </p>
    <p class="created-at">
      {{
        {
          [CommentStatus.READY]: data.createdAt + (data.updatedAt ? " *" : ""),
          [CommentStatus.SENDING]: "Sending...",
          [CommentStatus.UPDATING]: "Updating...",
          [CommentStatus.DELETING]: "Deleting...",
        }[data.status]
      }}
    </p>
    <div class="actions">
      <button
        v-if="isCurrentUser"
        class="delete-button"
        @click="store.deleteComment(data.id)"
      >
        <svg
          aria-hidden="true"
          width="12"
          height="14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
            fill="#ED6368"
          />
        </svg>
        Delete
      </button>

      <button
        v-if="isCurrentUser"
        class="edit-button"
        @click="isUpdating = true"
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
            fill="#5357B6"
          />
        </svg>
        Edit
      </button>

      <button v-else class="reply-button" @click="$emit('reply')">
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

    <form
      v-if="isUpdating"
      class="content edit-content-form"
      @submit.prevent="updateComment"
    >
      <label :for="fieldId" class="sr-only">Edit your comment</label>
      <textarea
        :id="fieldId"
        class="content-field"
        placeholder="Edit your comment"
        required
        v-model="contentValue"
        rows="5"
      />
      <button class="submit-button" type="submit">Update</button>
    </form>

    <p v-else class="content">
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

  transition: all 0.5s ease;
}

.comment.sending {
  scale: 0.9;
  opacity: 0.8;
}

.score {
  grid-row: 1 / -1;
  align-self: flex-start;
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
  display: flex;
  gap: 1rem;
}

.reply-button,
.edit-button,
.delete-button {
  border: none;
  background: none;
  font-weight: 500;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.edit-button,
.reply-button {
  color: var(--moderate-blue);
}

.delete-button {
  color: var(--soft-red);
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

.edit-content-form {
  display: grid;
  grid-auto-flow: row;
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

  justify-self: flex-end;
  margin-top: 1rem;
}

.submit-button:hover {
  background-color: var(--light-grayish-blue);
}
</style>
