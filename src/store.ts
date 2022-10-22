import { defineStore } from "pinia";
import { CommentStatus, IComment, IUser } from "./types";
import data from "./assets/data.json";

interface StoreState {
  currentUser: IUser;
  comments: IComment[];
  upvotes: IComment["id"][];
  downvotes: IComment["id"][];
}

let nextId = 11;

const REPLYING_TO_REGEX = /^@(\w+) /;

function parseComment(s: string): { content: string; replyingTo?: string } {
  return {
    content: s.replace(REPLYING_TO_REGEX, ""),
    replyingTo: s.match(REPLYING_TO_REGEX)?.at(1),
  };
}

export const useStore = defineStore("main", {
  state: (): StoreState => {
    return {
      currentUser: data.currentUser,
      comments: data.comments as IComment[],
      upvotes: [],
      downvotes: [],
    };
  },
  actions: {
    upvote(commentId: number) {
      if (!this.upvotes.includes(commentId)) {
        this.upvotes.push(commentId);
      }
      this.downvotes = this.downvotes.filter((id) => id !== commentId);
    },
    downvote(commentId: number) {
      if (!this.downvotes.includes(commentId)) {
        this.downvotes.push(commentId);
      }
      this.upvotes = this.upvotes.filter((id) => id !== commentId);
    },
    resetVote(commentId: number) {
      this.downvotes = this.downvotes.filter((id) => id !== commentId);
      this.upvotes = this.upvotes.filter((id) => id !== commentId);
    },
    postComment(content: string) {
      const id = nextId++;
      const newComment = {
        id,
        ...parseComment(content),
        createdAt: "Just Now",
        replies: [],
        user: this.currentUser,
        score: 0,
        status: CommentStatus.SENDING,
      };
      this.comments.push(newComment);
      this.upvotes.push(id);

      setTimeout(() => {
        this.comments.find((c) => c.id === id)!.status = CommentStatus.READY;
      }, 1000);
    },
    postReply(content: string, parentCommentId: number) {
      const id = nextId++;
      this.comments
        .find((c) => c.id === parentCommentId)
        ?.replies.push({
          id,
          ...parseComment(content),
          createdAt: "Just Now",
          replies: [],
          user: this.currentUser,
          score: 0,
          status: CommentStatus.SENDING,
        });
      this.upvotes.push(id);
    },
  },
});
