/**
 * Generate placeholder comments to demonstrate the application.
 */

import { faker } from "@faker-js/faker";
import fs from "node:fs/promises";

function generateComment(numberOfReplies) {
  const comment = {
    id: faker.datatype.uuid(),
    score: faker.datatype.number({ min: -3, max: 10 }),
    content: faker.lorem.paragraph(),
    createdAt: faker.date.recent().toISOString(),
    replies: [],
    status: 0,
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

const comments = [];

for (let i = 0; i < 5; i++) {
  comments.push(generateComment(faker.datatype.number({ min: 0, max: 3 })));
}

const currentUser = {
  image: {
    png: faker.image.avatar(),
    webp: faker.image.avatar(),
  },
  username: faker.internet.userName(),
};

fs.writeFile(
  new URL("../src/data.json", import.meta.url),
  JSON.stringify(
    {
      comments,
      currentUser,
    },
    null,
    2
  ),
  "utf-8"
)
  .then(() => {
    console.log("Successfully generated fake data.");
  })
  .catch((e) => {
    console.log("Failed to generate fake data");
    console.error(e);
    process.exit(1);
  });
