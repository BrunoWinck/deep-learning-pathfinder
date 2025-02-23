
import { Button } from '@/components/ui/button';
import { PathItemProps } from './types';

export const PathItem = ({
  path,
  isSelected,
  isEditing,
  editingName,
  onPathClick,
  onPathLongPress,
  onPathTouchEnd,
  onNameUpdate,
  onEditingNameChange,
}: PathItemProps) => {
  if (isEditing) {
    return (
      <div className="clock-adjust">
        <input
          type="text"
          value={editingName}
          onChange={(e) => onEditingNameChange(e.target.value)}
          className="new-input-name"
          autoFocus
          aria-label="Path name"
        />
        <Button size="sm" onClick={() => onNameUpdate(path.id)}>
          Save
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => onPathClick(path.id)}
      onTouchStart={() => onPathLongPress(path)}
      onTouchEnd={onPathTouchEnd}
      onMouseDown={() => onPathLongPress(path)}
      onMouseUp={onPathTouchEnd}
      onMouseLeave={onPathTouchEnd}
      className={`btn-path-item ${
        isSelected ? '-selected' : ''
      }`}
      role="button"
      aria-selected={isSelected}
    >
      {path.name}
    </button>
  );
};
