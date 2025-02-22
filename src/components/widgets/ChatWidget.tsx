
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useConversation } from '@11labs/react';

export const ChatWidget = () => {
  const { state, dispatch } = useApp();
  const [message, setMessage] = useState('');
  const conversation = useConversation();
  
  useEffect(() => {
    // Initialize conversation when voice is enabled
    if (state.voiceEnabled) {
      const initConversation = async () => {
        try {
          await conversation.startSession({
            agentId: "voice-chat-agent", // Replace with your actual agent ID from ElevenLabs
            overrides: {
              tts: {
                voiceId: "EXAVITQu4vr4xnSDxMaL" // Using Sarah's voice
              }
            }
          });
        } catch (error) {
          console.error("Failed to start conversation:", error);
        }
      };
      initConversation();
    } else {
      conversation.endSession();
    }
    
    return () => {
      conversation.endSession();
    };
  }, [state.voiceEnabled]);

  const addMessage = async (text: string, isAI: boolean) => {
    dispatch({
      type: 'ADD_CHAT_MESSAGE',
      payload: {
        id: crypto.randomUUID(),
        text,
        isAI,
        reactions: [],
        timestamp: Date.now(),
      },
    });

    // If it's an AI message and voice is enabled, use text-to-speech
    if (isAI && state.voiceEnabled) {
      try {
        await conversation.setVolume({ volume: 0.8 });
      } catch (error) {
        console.error("Failed to play voice:", error);
      }
    }
  };

  const addReaction = (messageId: string, reaction: '❤️' | '👍' | '👎' | '🙏') => {
    dispatch({
      type: 'ADD_REACTION',
      payload: { messageId, reaction },
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="flex gap-2 items-center">
          {conversation.isSpeaking && (
            <span className="text-sm text-muted-foreground animate-pulse">
              Speaking...
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch({ type: 'TOGGLE_VOICE', payload: !state.voiceEnabled })}
          >
            {state.voiceEnabled ? 'Mute' : 'Unmute'} Voice
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-4 mb-4">
        {state.chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.isAI ? 'items-start' : 'items-end'
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.isAI
                  ? 'bg-background border'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {msg.text}
            </div>
            {msg.isAI && (
              <div className="flex gap-1 mt-1">
                {['❤️', '👍', '👎', '🙏'].map((reaction) => (
                  <button
                    key={reaction}
                    onClick={() => addReaction(msg.id, reaction as '❤️' | '👍' | '👎' | '🙏')}
                    className="hover:scale-125 transition-transform"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            )}
            {msg.reactions.length > 0 && (
              <div className="flex gap-1 mt-1">
                {msg.reactions.map((reaction, i) => (
                  <span key={i}>{reaction}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 rounded border"
          placeholder="Type a message..."
        />
        <Button
          onClick={() => {
            if (message.trim()) {
              addMessage(message, false);
              setMessage('');
            }
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
