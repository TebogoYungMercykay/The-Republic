import { Comment } from "@/lib/types";

export const mockComments: Comment[] = [
  {
    comment_id: "1",
    issue_id: "27",
    user_id: "1",
    parent_comment_id: null,
    content: "This is a mock comment 1.",
    created_at: new Date().toISOString(),
    user: {
      user_id: "1",
      fullname: "John Doe",
      image_url: "https://example.com/john-doe.jpg",
      username: "johndoe",
      email_address: "john@example.com",
      bio: "This is John's bio."
    },
  },
  {
    comment_id: "2",
    issue_id: "27",
    user_id: "2",
    parent_comment_id: null,
    content: "This is a mock comment 2.",
    created_at: new Date().toISOString(),
    user: {
      user_id: "2",
      fullname: "Jane Smith",
      image_url: "https://example.com/jane-smith.jpg",
      username: "janesmith",
      email_address: "jane@example.com",
      bio: "This is Jane's bio."
    },
  },
  {
    comment_id: "3",
    issue_id: "27",
    user_id: "1",
    parent_comment_id: "1",
    content: "This is a reply to comment 1.",
    created_at: new Date().toISOString(),
    user: {
      user_id: "1",
      fullname: "John Doe",
      image_url: "https://example.com/john-doe.jpg",
      username: "johndoe",
      email_address: "john@example.com",
      bio: "This is John's bio."
    },
  },
  {
    comment_id: "4",
    issue_id: "27",
    user_id: "1",
    parent_comment_id: "1",
    content: "This is another reply to comment 1.",
    created_at: new Date().toISOString(),
    user: {
      user_id: "1",
      fullname: "John Doe",
      image_url: "https://example.com/john-doe.jpg",
      username: "johndoe",
      email_address: "john@example.com",
      bio: "This is John's bio."
    },
  },
  {
    comment_id: "5",
    issue_id: "27",
    user_id: "1",
    parent_comment_id: "4",
    content: "This is a reply to another reply.",
    created_at: new Date().toISOString(),
    user: {
      user_id: "1",
      fullname: "John Doe",
      image_url: "https://example.com/john-doe.jpg",
      username: "johndoe",
      email_address: "john@example.com",
      bio: "This is John's bio."
    },
  },
  {
    comment_id: "6",
    issue_id: "27",
    user_id: "2",
    parent_comment_id: "5",
    content: "This is a reply to the reply of another reply.",
    created_at: new Date().toISOString(),
    user: {
      user_id: "2",
      fullname: "Jane Smith",
      image_url: "https://example.com/jane-smith.jpg",
      username: "janesmith",
      email_address: "jane@example.com",
      bio: "This is Jane's bio."
    },
  },
  {
    comment_id: "7",
    issue_id: "27",
    user_id: "1",
    parent_comment_id: "6",
    content: "This is a reply to the reply to the reply of another reply.",
    created_at: new Date().toISOString(),
    user: {
      user_id: "1",
      fullname: "John Doe",
      image_url: "https://example.com/john-doe.jpg",
      username: "johndoe",
      email_address: "john@example.com",
      bio: "This is John's bio."
    },
  },
];
