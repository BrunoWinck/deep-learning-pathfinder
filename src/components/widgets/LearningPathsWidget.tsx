
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { LearningPath } from '@/types/learning';

export const LearningPathsWidget = () => {
  const { state, dispatch } = useApp();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleAddPath = () => {
    const newPath: LearningPath = {
      id: crypto.randomUUID(),
      name: "New Learning Path",
      body: "",
      sections: [],
      goals: [],
      resources: []
    };
    
    dispatch({ 
      type: 'SET_LEARNING_PATHS', 
      payload: [...state.learningPaths, newPath] 
    });
  };

  const selectedPathData = state.learningPaths.find(p => p.id === selectedPath);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Learning Paths</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddPath}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Path
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-2 mb-4">
          {state.learningPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path.id)}
              className={`w-full text-left p-2 rounded ${
                selectedPath === path.id ? 'bg-accent' : 'hover:bg-accent/50'
              }`}
            >
              {path.name}
            </button>
          ))}
        </div>

        {selectedPathData && (
          <div className="mt-4 space-y-4">
            <h3 className="font-medium">Path Details</h3>
            <div className="space-y-2">
              {selectedPathData.sections.map((section) => (
                <div key={section.id} className="p-2 bg-background rounded border">
                  <h4 className="font-medium">{section.name}</h4>
                  <div className="mt-2 space-y-1">
                    {section.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
