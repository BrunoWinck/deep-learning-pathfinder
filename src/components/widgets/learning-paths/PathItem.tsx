
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
      <div className="flex gap-2">
        <input
          type="text"
          value={editingName}
          onChange={(e) => onEditingNameChange(e.target.value)}
          className="flex-1 p-2 rounded border"
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
      className={`w-full text-left p-2 rounded ${
        isSelected ? 'bg-accent' : 'hover:bg-accent/50'
      }`}
      role="button"
      aria-selected={isSelected}
    >
      {path.name}
    </button>
  );
};
