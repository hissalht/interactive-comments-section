import { defineStore } from "pinia";
import { IComment, IUser } from "./types";
import data from "./assets/data.json";

interface StoreState {
  currentUser: IUser;
  comments: IComment[];
  upvotes: IComment["id"][];
  downvotes: IComment["id"][];
}

let nextId = 11;

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
      this.comments.push({
        id,
        content,
        createdAt: "Just Now",
        replies: [],
        user: this.currentUser,
        score: 0,
      });
      this.upvotes.push(id);
    },
  },
});
