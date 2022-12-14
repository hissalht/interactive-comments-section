import { defineStore } from "pinia";
import { CommentStatus, IComment, IUser } from "./types";
import data from "./data.json";

interface StoreState {
  currentUser: IUser;
  comments: IComment[];
  upvotes: IComment["id"][];
  downvotes: IComment["id"][];
}

const REPLYING_TO_REGEX = /^@([\w\.]+) /;

function parseComment(s: string): { content: string; replyingTo?: string } {
  return {
    content: s.replace(REPLYING_TO_REGEX, ""),
    replyingTo: s.match(REPLYING_TO_REGEX)?.at(1),
  };
}

function findComment(comments: IComment[], commentId: string) {
  for (const comment of comments) {
    if (comment.id === commentId) {
      return comment;
    }

    for (const reply of comment.replies) {
      if (reply.id === commentId) {
        return reply;
      }
    }
  }
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
    upvote(commentId: string) {
      if (!this.upvotes.includes(commentId)) {
        this.upvotes.push(commentId);
      }
      this.downvotes = this.downvotes.filter((id) => id !== commentId);
    },
    downvote(commentId: string) {
      if (!this.downvotes.includes(commentId)) {
        this.downvotes.push(commentId);
      }
      this.upvotes = this.upvotes.filter((id) => id !== commentId);
    },
    resetVote(commentId: string) {
      this.downvotes = this.downvotes.filter((id) => id !== commentId);
      this.upvotes = this.upvotes.filter((id) => id !== commentId);
    },
    postComment(content: string) {
      const id = crypto.randomUUID();
      const newComment = {
        id,
        ...parseComment(content),
        createdAt: new Date().toISOString(),
        replies: [],
        user: this.currentUser,
        score: 0,
        status: CommentStatus.SENDING,
      };
      this.comments.push(newComment);
      this.upvotes.push(id);

      setTimeout(() => {
        findComment(this.comments, id)!.status = CommentStatus.READY;
      }, 1000);
    },
    postReply(content: string, parentCommentId: string) {
      const id = crypto.randomUUID();
      this.comments
        .find((c) => c.id === parentCommentId)
        ?.replies.push({
          id,
          ...parseComment(content),
          createdAt: new Date().toISOString(),
          replies: [],
          user: this.currentUser,
          score: 0,
          status: CommentStatus.SENDING,
        });
      this.upvotes.push(id);

      setTimeout(() => {
        findComment(this.comments, id)!.status = CommentStatus.READY;
      }, 1000);
    },

    updateComment(commentId: string, content: string) {
      const comment = findComment(this.comments, commentId);

      if (!comment) {
        throw new Error(`Cannot find comment with id ${commentId}`);
      }

      const parsedContent = parseComment(content);
      comment.content = parsedContent.content;
      comment.replyingTo = parsedContent.replyingTo;
      comment.updatedAt = new Date().toISOString();

      comment.status = CommentStatus.UPDATING;

      setTimeout(() => {
        comment.status = CommentStatus.READY;
      }, 1000);
    },

    deleteComment(commentId: string) {
      const comment = findComment(this.comments, commentId);

      if (!comment) {
        throw new Error(`Cannot find comment with id ${commentId}`);
      }

      comment.status = CommentStatus.DELETING;

      setTimeout(() => {
        const commentIndex = this.comments.findIndex((c) => c.id === commentId);

        if (commentIndex !== -1) {
          this.comments.splice(commentIndex, 1);
          return;
        }

        for (const comment of this.comments) {
          const commentIndex = comment.replies.findIndex(
            (c) => c.id === commentId
          );

          if (commentIndex !== -1) {
            comment.replies.splice(commentIndex, 1);
            return;
          }
        }
      }, 1000);
    },
  },
});
