
export interface Section {
  id: string;
  name: string;
  body: string;
  steps: string[];
  goals: string[];
  resources: string[];
}

export interface LearningPath {
  id: string;
  name: string;
  body: string;
  sections: Section[];
  goals: string[];
  resources: string[];
}
