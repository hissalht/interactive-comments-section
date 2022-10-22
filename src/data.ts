import { faker } from "@faker-js/faker";
import { CommentStatus, IComment } from "./types";

function generateComment(numberOfReplies: number): IComment {
  const comment: IComment = {
    id: faker.datatype.uuid(),
    score: faker.datatype.number({ min: -3, max: 10 }),
    content: faker.lorem.paragraph(),
    createdAt: faker.date.recent().toISOString(),
    replies: [],
    status: CommentStatus.READY,
    user: {
      image: {
        png: faker.image.avatar(),
        webp: faker.image.avatar(),
      },
      username: faker.internet.userName(),
    },
  };

  for (let i = 0; i < numberOfReplies; i++) {
    comment.replies.push(generateComment(0));
  }

  return comment;
}

const comments: IComment[] = [];

for (let i = 0; i < 5; i++) {
  comments.push(generateComment(faker.datatype.number({ min: 0, max: 3 })));
}

export default {
  comments,
  currentUser: {
    image: {
      png: faker.image.avatar(),
      webp: faker.image.avatar(),
    },
    username: faker.internet.userName(),
  },
};
