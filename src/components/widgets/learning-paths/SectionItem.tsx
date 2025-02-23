
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
      <div className="section-edit">
        <input
          type="text"
          value={editingName}
          onChange={(e) => onEditingNameChange(e.target.value)}
          className="new-input-name"
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
      className="section-name-editable"
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
