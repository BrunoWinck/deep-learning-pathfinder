
import { AppState } from '@/types/app-state';

export const initialState: AppState = {
  learningPaths: [
    {
      id: "1",
      name: "AI Agent",
      body: "My path to learn to code AI Agent",
      sections: [
        {
          id: "2",
          name: "overview",
          body: "watch a few videos to get an idea of the topic",
          steps: [],
          goals: [],
          resources: [
            {
              title: "Introduction to AI Agents",
              link: "https://www.youtube.com/watch?v=TfqioNAP1W4"
            }
          ]
        }
      ],
      goals: [],
      resources: []
    }
  ],
  activePath: null,
  chatMessages: [],
  searchQueries: [],
  learningStatements: [],
  aiQueries: [],
  voiceEnabled: true,
  activeResourceLink: null,
  xAPIConfig: {
    endpoint: 'https://lrs.adlnet.gov/xapi',
    credentials: {
      username: 'xapi-tools',
      password: 'xapi-tools'
    }
  }
};
