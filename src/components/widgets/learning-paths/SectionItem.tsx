
import { Button } from '@/components/ui/button';
import { SectionItemProps } from './types';

export const SectionItem = ({
  section,
  isEditing,
  editingName,
  pathId,
  onSectionLongPress,
  onPathTouchEnd,
  onSectionNameUpdate,
  onEditingNameChange,
}: SectionItemProps) => {
  if (isEditing) {
    return (
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={editingName}
          onChange={(e) => onEditingNameChange(e.target.value)}
          className="flex-1 p-2 rounded border"
          autoFocus
          aria-label="Section name"
        />
        <Button
          size="sm"
          onClick={() => onSectionNameUpdate(pathId, section.id)}
        >
          Save
        </Button>
      </div>
    );
  }

  return (
    <h4
      className="font-medium mb-2 cursor-pointer"
      onTouchStart={() => onSectionLongPress(section)}
      onTouchEnd={onPathTouchEnd}
      onMouseDown={() => onSectionLongPress(section)}
      onMouseUp={onPathTouchEnd}
      onMouseLeave={onPathTouchEnd}
      role="heading"
      aria-level={4}
    >
      {section.name}
    </h4>
  );
};
