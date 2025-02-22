
import { AppAction } from '@/types/app-state';

export class LearningCoach {
  private timerId: number | null = null;

  constructor(private dispatch: (action: AppAction) => void) {}

  start() {
    // Initial greeting after 10 seconds
    this.timerId = window.setTimeout(() => {
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
    }, 10000);
  }

  stop() {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
