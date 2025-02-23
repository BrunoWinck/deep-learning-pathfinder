
import { useState, useEffect } from 'react';
import { PlusCircle, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { LearningPath, Section } from '@/types/learning';
import { PathItem } from './learning-paths/PathItem';
import { SectionItem } from './learning-paths/SectionItem';
import { StepItem } from './learning-paths/StepItem';
import { NewStepForm } from './learning-paths/NewStepForm';

// Interface for the persisted state
interface PersistedState {
  selectedPath: string | null;
  focusedStep: {
    pathId: string;
    sectionId: string;
    stepIndex: number;
  } | null;
}

const STORAGE_KEY = 'learning_paths_state';

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
  const [focusedStep, setFocusedStep] = useState<{
    pathId: string;
    sectionId: string;
    stepIndex: number;
  } | null>(null);
  let editTimer: ReturnType<typeof setTimeout>;

  // Load persisted state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState) as PersistedState;
      setSelectedPath(parsed.selectedPath);
      setFocusedStep(parsed.focusedStep);
    }
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    const stateToSave: PersistedState = {
      selectedPath,
      focusedStep
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [selectedPath, focusedStep]);

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

  const handleStepLongPress = (step: string, index: number, pathId: string, sectionId: string) => {
    editTimer = setTimeout(() => {
      setEditingStepIndex(index);
      setEditingStepName(step);
      setFocusedStep({ pathId, sectionId, stepIndex: index });
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

  const setResourceLink = (link: string) => {
    dispatch({ type: 'SET_ACTIVE_RESOURCE_LINK', payload: link });
  };

  const selectedPathData = state.learningPaths.find(p => p.id === selectedPath);

  return (
    <div className="widget-ext">
      <div className="-header">
        <h2 className="-title">Learning Paths</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddPath}
          className="widget-button"
          aria-label="Add Path"
        >
          <PlusCircle className="icon1" />
          Add Path
        </Button>
      </div>

      <div className="learning-paths-container">
        <div className="learning-paths-list" role="list" aria-label="Learning paths">
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
                <div className="learningpath-resources">
                  {path.resources.map((resource, index) => (
                    <div key={index} className="-resource">
                      <button
                        className="--button"
                        onClick={() => setResourceLink(resource.link)}
                        aria-label={`Select ${resource.title} resource`}
                      >
                        <Link2 size={14} />
                      </button>
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {resource.title}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedPathData && (
          <div className="path-detail">
            <div className="path-detail-header">
              <h3 className="path-details-title">Path Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddSection(selectedPathData.id)}
                className="widget-button"
                aria-label="Add Section"
              >
                <PlusCircle className="icon1" />
                Add Section
              </Button>
            </div>
            <div className="plan-sections" role="list" aria-label="Sections">
              {selectedPathData.sections.map((section) => (
                <div key={section.id} className="plan-section" role="listitem">
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
                    <div className="resources-list">
                      {section.resources.map((resource, index) => (
                        <div key={index} className="-resource">
                          <button
                            className="--button"
                            onClick={() => setResourceLink(resource.link)}
                            aria-label={`Select ${resource.title} resource`}
                          >
                            <Link2 size={14} />
                          </button>
                          <a 
                            href={resource.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {resource.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="steps-list" role="list" aria-label="Steps">
                    {section.steps.map((step, index) => (
                      <div key={index} className="step" role="listitem">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          aria-label={`Mark step ${index + 1} as complete`}
                          checked={focusedStep?.pathId === selectedPathData.id && 
                                 focusedStep?.sectionId === section.id && 
                                 focusedStep?.stepIndex === index}
                          onChange={() => setFocusedStep({
                            pathId: selectedPathData.id,
                            sectionId: section.id,
                            stepIndex: index
                          })}
                        />
                        <StepItem
                          step={step}
                          index={index}
                          isEditing={editingStepIndex === index}
                          editingName={editingStepName}
                          pathId={selectedPathData.id}
                          sectionId={section.id}
                          onStepLongPress={(step, index) => handleStepLongPress(step, index, selectedPathData.id, section.id)}
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
