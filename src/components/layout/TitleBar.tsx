
import { useState, useEffect } from 'react';
import { Clock, FastForward, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const TitleBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date(Date.now() + timeOffset));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOffset]);

  const advanceTime = (hours: number) => {
    setTimeOffset(prev => prev + (hours * 60 * 60 * 1000));
  };

  return (
    <div className="p-4 bg-secondary border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        <span className="text-lg font-medium">
          {currentTime.toLocaleString('en-US', { 
            dateStyle: 'medium', 
            timeStyle: 'medium',
            hour12: false 
          })}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => advanceTime(1)}
          className="flex items-center gap-1"
        >
          <FastForward className="h-4 w-4" />
          +1h
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => advanceTime(24)}
          className="flex items-center gap-1"
        >
          <FastForward className="h-4 w-4" />
          +1d
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => advanceTime(168)}
          className="flex items-center gap-1"
        >
          <FastForward className="h-4 w-4" />
          +1w
        </Button>
      </div>
    </div>
  );
};
