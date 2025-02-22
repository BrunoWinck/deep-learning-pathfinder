import { useState } from 'react';
import { PlusCircle, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { LearningPath, Section } from '@/types/learning';
import { PathItem } from './learning-paths/PathItem';
import { SectionItem } from './learning-paths/SectionItem';
import { StepItem } from './learning-paths/StepItem';
import { NewStepForm } from './learning-paths/NewStepForm';
import { useToast } from '@/components/ui/use-toast';

export const LearningPathsWidget = () => {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
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

  const setResourceLink = (link: string, title: string) => {
    dispatch({ type: 'SET_ACTIVE_RESOURCE_LINK', payload: link });
    toast({
      title: "Resource selected",
      description: `Selected resource: ${title}`
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
          aria-label="Add Path"
        >
          <PlusCircle className="h-4 w-4" />
          Add Path
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-2 mb-4" role="list" aria-label="Learning paths">
          {state.learningPaths.map((path) => (
            <div key={path.id} role="listitem">
              <PathItem
                path={path}
                isSelected={selectedPath === path.id}
                isEditing={editingPath === path.id}
                editingName={editingName}
                onPathClick={handlePathClick}
                onPathLongPress={handlePathLongPress}
                onPathTouchEnd={handlePathTouchEnd}
                onNameUpdate={handleNameUpdate}
                onEditingNameChange={setEditingName}
              />
              {path.resources.length > 0 && (
                <div className="ml-4 mt-1 space-y-1">
                  {path.resources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <button
                        className="p-1 hover:text-primary"
                        onClick={() => setResourceLink(resource.link, resource.title)}
                        aria-label={`Select ${resource.title} resource`}
                      >
                        <Link2 size={14} />
                      </button>
                      <span>{resource.title}</span>
                    </div>
                  ))}
                </div>
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
                aria-label="Add Section"
              >
                <PlusCircle className="h-4 w-4" />
                Add Section
              </Button>
            </div>
            <div className="space-y-2" role="list" aria-label="Sections">
              {selectedPathData.sections.map((section) => (
                <div key={section.id} className="p-2 bg-background rounded border" role="listitem">
                  <SectionItem
                    section={section}
                    isEditing={editingSection === section.id}
                    editingName={editingSectionName}
                    pathId={selectedPathData.id}
                    onSectionLongPress={handleSectionLongPress}
                    onPathTouchEnd={handlePathTouchEnd}
                    onSectionNameUpdate={handleSectionNameUpdate}
                    onEditingNameChange={setEditingSectionName}
                  />
                  {section.resources.length > 0 && (
                    <div className="ml-4 mb-2 space-y-1">
                      {section.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <button
                            className="p-1 hover:text-primary"
                            onClick={() => setResourceLink(resource.link, resource.title)}
                            aria-label={`Select ${resource.title} resource`}
                          >
                            <Link2 size={14} />
                          </button>
                          <span>{resource.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 space-y-1" role="list" aria-label="Steps">
                    {section.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2" role="listitem">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          aria-label={`Mark step ${index + 1} as complete`}
                        />
                        <StepItem
                          step={step}
                          index={index}
                          isEditing={editingStepIndex === index}
                          editingName={editingStepName}
                          pathId={selectedPathData.id}
                          sectionId={section.id}
                          onStepLongPress={handleStepLongPress}
                          onPathTouchEnd={handlePathTouchEnd}
                          onStepNameUpdate={handleStepNameUpdate}
                          onEditingNameChange={setEditingStepName}
                        />
                      </div>
                    ))}
                    <NewStepForm
                      newStepText={newStepText}
                      onNewStepTextChange={setNewStepText}
                      onAddStep={() => handleAddStep(selectedPathData.id, section.id)}
                    />
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
