
export interface Section {
  id: string;
  name: string;
  body: string;
  steps: string[];
  goals: string[];
  resources: Array<{
    title: string;
    link: string;
  }>;
}

export interface LearningPath {
  id: string;
  name: string;
  body: string;
  sections: Section[];
  goals: string[];
  resources: Array<{
    title: string;
    link: string;
  }>;
}
