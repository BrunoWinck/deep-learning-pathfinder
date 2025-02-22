
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TitleBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeOffset, setTimeOffset] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date(Date.now() + timeOffset));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOffset]);

  const advanceTime = (hours: number) => {
    setTimeOffset(prev => prev + (hours * 60 * 60 * 1000));
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500); // Duration matches the CSS animation
  };

  return (
    <div className="p-4 bg-secondary border-b flex items-center justify-between">
      <div className="text-lg font-bold">
        Hackathon
      </div>
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded transition-colors duration-500",
          animate && "bg-blue-100"
        )}>
          <Clock className="h-5 w-5" />
          <span className="text-lg">
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
          >
            +1h
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => advanceTime(24)}
          >
            +1d
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => advanceTime(168)}
          >
            +1w
          </Button>
        </div>
      </div>
    </div>
  );
};
