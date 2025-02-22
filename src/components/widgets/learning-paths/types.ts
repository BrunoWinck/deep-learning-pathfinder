
import { LearningPath, Section } from '@/types/learning';

export interface PathItemProps {
  path: LearningPath;
  isSelected: boolean;
  isEditing: boolean;
  editingName: string;
  onPathClick: (pathId: string) => void;
  onPathLongPress: (path: LearningPath) => void;
  onPathTouchEnd: () => void;
  onNameUpdate: (pathId: string) => void;
  onEditingNameChange: (name: string) => void;
}

export interface SectionItemProps {
  section: Section;
  isEditing: boolean;
  editingName: string;
  pathId: string;
  onSectionLongPress: (section: Section) => void;
  onPathTouchEnd: () => void;
  onSectionNameUpdate: (pathId: string, sectionId: string) => void;
  onEditingNameChange: (name: string) => void;
}

export interface StepItemProps {
  step: string;
  index: number;
  isEditing: boolean;
  editingName: string;
  pathId: string;
  sectionId: string;
  onStepLongPress: (step: string, index: number) => void;
  onPathTouchEnd: () => void;
  onStepNameUpdate: (pathId: string, sectionId: string, index: number) => void;
  onEditingNameChange: (name: string) => void;
}
