
import { AppAction, AppState } from '@/types/app-state';

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
      const now = Date.now();
      console.log( "agent check", now);
      // Initial greeting after 10 seconds
      if (!this.nudgedVideos.has( "greetings")) {
        if ( now - this.start1 > 10000 ) {
          this.nudgedVideos.add( "greetings");
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
