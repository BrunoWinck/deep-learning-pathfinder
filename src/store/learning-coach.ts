
import { AppAction, AppState } from '@/types/app-state';
import { Mistral } from '@mistralai/mistralai';

  /**
   * This function retrieves the payment status of a transaction id.
   * @param {object} data - The data object.
   * @param {string} transactionId - The transaction id.
   * @return {string} - The payment status.
   */
  function retrieveVideoHoursSinceLastWatched({ state /*, transactionId*/}) {
    const recentWatchedStatements = state.learningStatements
      .filter(stmt => 
        stmt.verb === 'watched' && 
        stmt.timestamp > twentyHoursAgo
      );
    if ( recentWatchedStatements.length > 0)
      return JSON.stringify({status: (recentWatchedStatements[0].timestamp - Date.now())/1000/60/60});
    else
      return JSON.stringify({status: 99999});
    /*
    const transactionIndex = data.transactionId.indexOf(transactionId);
    if (transactionIndex != -1) {
      return JSON.stringify({status: data.paymentStatus[transactionIndex]});
    } else {
      return JSON.stringify({status: 'error - transaction id not found.'});
    }
      */
  }

  /**
   * This function retrieves the payment date of a transaction id.
   * @param {object} data - The data object.
   * @param {string} transactionId - The transaction id.
   * @return {string} - The payment date.
   *
   */
  function retrieveRetrieveCount({ state /*, transactionId*/}) {
    return JSON.stringify({status: 0});
    /*
    const transactionIndex = data.transactionId.indexOf(transactionId);
    if (transactionIndex != -1) {
      return JSON.stringify({status: data.payment_date[transactionIndex]});
    } else {
      return JSON.stringify({status: 'error - transaction id not found.'});
    }
      */
  }

  const namesToFunctions0 = data => ({
    retrieveVideoHoursSinceLastWatched: ( /*transactionId*/) =>
      retrieveVideoHoursSinceLastWatched({data /*, ...transactionId*/}),
    retrieveRetrieveCount: ( /*transactionId*/) =>
      retrieveRetrieveCount({data /*, ...transactionId*/}),
  });

  const tools = [
  {
    type: 'function',
    function: {
      name: 'retrieveVideoHoursSinceLastWatched',
      description: 'Get time since last artifact was being consumed in hours',
      parameters: {
        type: 'object',
        // required: ['transactionId'],
        required: [],
        properties: {
          // transactionId: {type: 'string', description: 'The transaction id.'},
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'retrieveRetrieveCount',
      description: 'Get count of comments, insights and key terms related to this artifact being retrieved and captured since then',
      parameters: {
        type: 'object',
        required: [],
        // required: ['transactionId'],
        properties: {
          // transactionId: {type: 'string', description: 'The transaction id.'},
        },
      },
    },
  },
];

export class LearningCoach {
  private checkTimerId: number | null = null;
  private nudgedVideos: Set<string> = new Set();
  start1 = Date.now();

  constructor(
    private dispatch: (action: AppAction) => void,
    private getState: () => AppState
  ) {}

  start() {

    // Start periodic check every 30 seconds
    this.checkTimerId = window.setInterval(() => {
      const state = this.getState();
      console.log( "state", state);
      // make this call early to capture the closure before a state change
      const namesToFunctions = namesToFunctions0( state);
      const now = Date.now();
      console.log( "agent check", now);
      // Initial greeting after 10 seconds
      if (!this.nudgedVideos.has( "greetings")) {
        if ( now - this.start1 > 10000 ) {
          this.nudgedVideos.add( "greetings");

          const apiKey = ""; // process.env.MISTRAL_API_KEY;
          
          const client = new Mistral({apiKey: apiKey});
          const messages = [
            {role: 'user', content: 'What would you advise I do next for my learning?'},
            // {role: 'user', content: 'What are the worst learning methods? Stay concise'},
            // {role: 'tool', name: 'retrievePaymentStatus', content: 'I am a tool'},
          ];
                    
          const startRequestTime = Date.now();
          // https://docs.mistral.ai/capabilities/agents/
          // client.chat.complete({
          client.agents.complete({
              // model: 'mistral-large-latest',
            agentId: 'ag:d8c41eb7:20250222:learning-coach-agent:ab5ce63b',
            tools: tools,
            messages: messages, 
          }).then( response => {
            console.log( "time in ms", Date.now() - startRequestTime);
            console.log( "response", response);
            console.log( "response", response.choices[0].finishReason);
            console.log( "response", response.choices[0].message.content);
            console.log( "tool_calls", response.choices[0].message.toolCalls);

            if ( response.choices[0].finishReason == "tool_calls")
            {
              // https://github.com/mistralai/client-js/blob/main/examples/function_calling.js
              messages.push(response.choices[0].message);
              for ( let i = 0; i < response.choices[0].message.toolCalls.length; i++) {
                const toolCall = response.choices[0].message.toolCalls[ i];

                const functionName = toolCall.function.name;
                const functionParams = JSON.parse(toolCall.function.arguments);
                console.log(`calling functionName: ${functionName}`);
                console.log(`functionParams: ${toolCall.function.arguments}`);
                
                const functionResult = namesToFunctions[functionName](functionParams);
                messages.push({
                  role: 'tool',
                  name: functionName,
                  content: functionResult,
                  toolCallId: toolCall.id,
                });
              }
              window.setTimeout( () => {
                console.log( "messages", messages);
              
                const startRequestTime = Date.now();
                client.agents.complete({
                  // model: 'mistral-large-latest',
                  agentId: 'ag:d8c41eb7:20250222:learning-coach-agent:ab5ce63b',
                  //    const chatResponse = await client.chat({
                  // model: model,
                  messages: messages,
                  tools: tools,
                }).then( response => {
                  console.log( "time in ms", Date.now() - startRequestTime);
                  console.log( "response", response.choices[0].message.content);
                  console.log( "tool_calls", response.choices[0].message.tool_calls);
                  this.dispatch({
                    type: 'ADD_AI_QUERY',
                    payload: {
                      prompt: messages.map( msg => `${msg.role}:${msg.content}`).join("\n"),
                      response: response.choices[0].message.content,
                      id: crypto.randomUUID(),
                      timestamp: Date.now(),
                    },
                  });
                    // could be iterative again
                  this.dispatch({
                    type: 'ADD_CHAT_MESSAGE',
                    payload: {
                      id: crypto.randomUUID(),
                      text: response.choices[0].message.content,
                      isAI: true,
                      reactions: [],
                      timestamp: Date.now(),
                    },
                  });
                });
              }
              , 5000);
            } else {
              console.log( "no tool calls");                                    
              this.dispatch({
                type: 'ADD_AI_QUERY',
                payload: {
                  prompt: messages.map( msg => `${msg.role}:${msg.content}`).join("\n"),
                  response: response.choices[0].message.content,
                  id: crypto.randomUUID(),
                  timestamp: Date.now(),
                },
              });
              this.dispatch({
                type: 'ADD_CHAT_MESSAGE',
                payload: {
                  id: crypto.randomUUID(),
                  text: response.choices[0].message.content,
                  isAI: true,
                  reactions: [],
                  timestamp: Date.now(),
                },
              });
            }
          });
          this.dispatch({
            type: 'ADD_CHAT_MESSAGE',
            payload: {
              id: crypto.randomUUID(),
              text: "Hi I'm your Learning coach",
              isAI: true,
              reactions: [],
              timestamp: Date.now(),
            },
          });
        }
      this.checkForUnpracticedVideos( now, state);
      }
    }, 10000);
  }

  stop() {
    if (this.checkTimerId !== null) {
      window.clearInterval(this.checkTimerId);
      this.checkTimerId = null;
    }
  }

  private checkForUnpracticedVideos( now, state) {
    const twentyHoursAgo = now - (20 * 60 * 60 * 1000); // 20 hours in milliseconds

    // Get all watched statements from the last 20 hours
    const recentWatchedStatements = state.learningStatements
      .filter(stmt => 
        stmt.verb === 'watched' && 
        stmt.timestamp > twentyHoursAgo
      );

    console.log( "recentWatchedStatements", recentWatchedStatements.length);
    // For each watched statement, check if it needs practice
    recentWatchedStatements.forEach(watchedStmt => {
      console.log( "check", watchedStmt.object);

      // Skip if we've already nudged about this video
      if (this.nudgedVideos.has(watchedStmt.object)) {
        console.log( "already nudged", this.nudgedVideos, watchedStmt.object);
        return;
      }

      // Count related practice statements (comments) for this video
      const relatedComments = state.learningStatements.filter(stmt => 
        stmt.object === watchedStmt.object && 
        stmt.comment.trim().length > 0
      );
      console.log( "relatedComments", relatedComments.length);

      // If less than 6 practice statements, send a nudge
      if (relatedComments.length < 6) {
        this.sendNudge(watchedStmt.object);
        this.nudgedVideos.add(watchedStmt.object);
      }
    });
  }

  private sendNudge(videoUrl: string) {
    const videoTitle = new URL(videoUrl).pathname.split('/').pop() || 'this video';
    
    this.dispatch({
      type: 'ADD_CHAT_MESSAGE',
      payload: {
        id: crypto.randomUUID(),
        text: `I noticed you watched ${videoTitle} but haven't practiced retrieval on it yet. Try to write down at least 6 key points you remember from the video.`,
        isAI: true,
        reactions: [],
        timestamp: Date.now(),
      },
    });
  }
}
