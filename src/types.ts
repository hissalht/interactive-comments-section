export interface IUser {
  username: string;
  image: {
    png: string;
    webp: string;
  };
}

export interface IComment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo?: string;
  user: IUser;
  replies: IComment[];
}
