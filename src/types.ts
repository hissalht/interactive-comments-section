export interface IUser {
  username: string;
  image: {
    png: string;
    webp: string;
  };
}

export enum CommentStatus {
  READY,
  SENDING,
  UPDATING,
  DELETING,
}

export interface IComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  score: number;
  replyingTo?: string;
  user: IUser;
  replies: IComment[];
  status: CommentStatus;
}
