
import { Button } from '@/components/ui/button';
import { StepItemProps } from './types';

export const StepItem = ({
  step,
  index,
  isEditing,
  editingName,
  pathId,
  sectionId,
  onStepLongPress,
  onPathTouchEnd,
  onStepNameUpdate,
  onEditingNameChange,
}: StepItemProps) => {
  if (isEditing) {
    return (
      <div className="step-edit">
        <input
          type="text"
          value={editingName}
          onChange={(e) => onEditingNameChange(e.target.value)}
          className="step-name-input"
          autoFocus
          aria-label="Step name"
        />
        <Button
          size="sm"
          onClick={() => onStepNameUpdate(pathId, sectionId, index)}
        >
          Save
        </Button>
      </div>
    );
  }

  return (
    <span
      className="step-button"
      onTouchStart={() => onStepLongPress(step, index)}
      onTouchEnd={onPathTouchEnd}
      onMouseDown={() => onStepLongPress(step, index)}
      onMouseUp={onPathTouchEnd}
      onMouseLeave={onPathTouchEnd}
      role="button"
    >
      {step}
    </span>
  );
};
