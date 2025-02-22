import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { LearningPath, Section } from '@/types/learning';

export const LearningPathsWidget = () => {
  const { state, dispatch } = useApp();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingSectionName, setEditingSectionName] = useState('');
  const [editingStepName, setEditingStepName] = useState('');
  const [newStepText, setNewStepText] = useState('');
  let editTimer: ReturnType<typeof setTimeout>;

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

  const handlePathClick = (pathId: string) => {
    setSelectedPath(pathId);
  };

  const handlePathLongPress = (path: LearningPath) => {
    editTimer = setTimeout(() => {
      setEditingPath(path.id);
      setEditingName(path.name);
    }, 500);
  };

  const handleSectionLongPress = (section: Section) => {
    editTimer = setTimeout(() => {
      setEditingSection(section.id);
      setEditingSectionName(section.name);
    }, 500);
  };

  const handlePathTouchEnd = () => {
    clearTimeout(editTimer);
  };

  const handleNameUpdate = (pathId: string) => {
    const updatedPaths = state.learningPaths.map(path => 
      path.id === pathId ? { ...path, name: editingName } : path
    );
    dispatch({ type: 'SET_LEARNING_PATHS', payload: updatedPaths });
    setEditingPath(null);
  };

  const handleSectionNameUpdate = (pathId: string, sectionId: string) => {
    const updatedPaths = state.learningPaths.map(path => {
      if (path.id === pathId) {
        return {
          ...path,
          sections: path.sections.map(section =>
            section.id === sectionId ? { ...section, name: editingSectionName } : section
          )
        };
      }
      return path;
    });
    dispatch({ type: 'SET_LEARNING_PATHS', payload: updatedPaths });
    setEditingSection(null);
  };

  const handleAddSection = (pathId: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      name: "New Section",
      body: "",
      steps: [],
      goals: [],
      resources: []
    };

    const updatedPaths = state.learningPaths.map(path => {
      if (path.id === pathId) {
        return {
          ...path,
          sections: [...path.sections, newSection]
        };
      }
      return path;
    });

    dispatch({ type: 'SET_LEARNING_PATHS', payload: updatedPaths });
  };

  const handleAddStep = (pathId: string, sectionId: string) => {
    if (!newStepText.trim()) return;

    const updatedPaths = state.learningPaths.map(path => {
      if (path.id === pathId) {
        return {
          ...path,
          sections: path.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                steps: [...section.steps, newStepText]
              };
            }
            return section;
          })
        };
      }
      return path;
    });

    dispatch({ type: 'SET_LEARNING_PATHS', payload: updatedPaths });
    setNewStepText('');
  };

  const handleStepLongPress = (step: string, index: number) => {
    editTimer = setTimeout(() => {
      setEditingStepIndex(index);
      setEditingStepName(step);
    }, 500);
  };

  const handleStepNameUpdate = (pathId: string, sectionId: string, stepIndex: number) => {
    const updatedPaths = state.learningPaths.map(path => {
      if (path.id === pathId) {
        return {
          ...path,
          sections: path.sections.map(section => {
            if (section.id === sectionId) {
              const updatedSteps = [...section.steps];
              updatedSteps[stepIndex] = editingStepName;
              return {
                ...section,
                steps: updatedSteps
              };
            }
            return section;
          })
        };
      }
      return path;
    });
    dispatch({ type: 'SET_LEARNING_PATHS', payload: updatedPaths });
    setEditingStepIndex(null);
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
            <div key={path.id}>
              {editingPath === path.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 p-2 rounded border"
                    autoFocus
                  />
                  <Button size="sm" onClick={() => handleNameUpdate(path.id)}>
                    Save
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => handlePathClick(path.id)}
                  onTouchStart={() => handlePathLongPress(path)}
                  onTouchEnd={handlePathTouchEnd}
                  onMouseDown={() => handlePathLongPress(path)}
                  onMouseUp={handlePathTouchEnd}
                  onMouseLeave={handlePathTouchEnd}
                  className={`w-full text-left p-2 rounded ${
                    selectedPath === path.id ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                >
                  {path.name}
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedPathData && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Path Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddSection(selectedPathData.id)}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Section
              </Button>
            </div>
            <div className="space-y-2">
              {selectedPathData.sections.map((section) => (
                <div key={section.id} className="p-2 bg-background rounded border">
                  {editingSection === section.id ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editingSectionName}
                        onChange={(e) => setEditingSectionName(e.target.value)}
                        className="flex-1 p-2 rounded border"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSectionNameUpdate(selectedPathData.id, section.id)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <h4
                      className="font-medium mb-2 cursor-pointer"
                      onTouchStart={() => handleSectionLongPress(section)}
                      onTouchEnd={handlePathTouchEnd}
                      onMouseDown={() => handleSectionLongPress(section)}
                      onMouseUp={handlePathTouchEnd}
                      onMouseLeave={handlePathTouchEnd}
                    >
                      {section.name}
                    </h4>
                  )}
                  <div className="mt-2 space-y-1">
                    {section.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        {editingStepIndex === index ? (
                          <div className="flex flex-1 gap-2">
                            <input
                              type="text"
                              value={editingStepName}
                              onChange={(e) => setEditingStepName(e.target.value)}
                              className="flex-1 p-1 rounded border text-sm"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={() => handleStepNameUpdate(selectedPathData.id, section.id, index)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <span
                            className="flex-1 cursor-pointer"
                            onTouchStart={() => handleStepLongPress(step, index)}
                            onTouchEnd={handlePathTouchEnd}
                            onMouseDown={() => handleStepLongPress(step, index)}
                            onMouseUp={handlePathTouchEnd}
                            onMouseLeave={handlePathTouchEnd}
                          >
                            {step}
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newStepText}
                        onChange={(e) => setNewStepText(e.target.value)}
                        placeholder="New step..."
                        className="flex-1 p-2 rounded border"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddStep(selectedPathData.id, section.id)}
                      >
                        Add
                      </Button>
                    </div>
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
