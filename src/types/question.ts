export interface Vote {
  likes: number;
  dislikes: number;
}

export interface Tag {
  tag_id: number;
  name: string;
  description: string;
}

export interface Comment {
  comment_id: number;
  user_id: number;
  username: string;
  comment_text: string;
  created_at: string;
}

export interface Answer {
  answer_id: number;
  user_id: number;
  username: string;
  title: string;
  description: string;
  votes: Vote;
  created_at: string;
  updated_at: string;
  comments: Comment[];
}

export interface Question {
  question_id: number;
  user_id: number;
  username: string;
  title: string;
  description: string;
  votes: Vote;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  answers: Answer[];
  answer_count: number;
}
