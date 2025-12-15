export interface Project {
  id: number;
  title: string;
  subtitle: string;
  metric: string; // Key performance metric (e.g., "40% Faster")
  tags: string[];
  imageUrl: string;
  bgGradient: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface TriviaState {
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Frontend' | 'Backend' | 'Design' | 'AI';
}