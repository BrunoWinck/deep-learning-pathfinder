
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
  searchQueries: [
    {
      "title": "Building AI Agents: Lessons Learned over the past Year | by Patrick Dougherty | Medium",
      "link": "https://medium.com/@cpdough/building-ai-agents-lessons-learned-over-the-past-year-41dc4725d8e5"
    },
    {
      "title": "Now See This: NVIDIA Launches Blueprint for AI Agents That Can Analyze Video | NVIDIA Blog",
      "link": "https://blogs.nvidia.com/blog/metropolis-ai-blueprint-video/"
    },
    {
      "title": "Building AI agents: a practical guide with real examples – n8n Blog",
      "link": "https://blog.n8n.io/ai-agents/"
    },
    {
      "title": "How to Build an AI Agent: 7 Main Steps | Uptech",
      "link": "https://www.uptech.team/blog/how-to-build-an-ai-agent"
    }
  ],
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
