
import { Button } from '@/components/ui/button';

interface NewStepFormProps {
  newStepText: string;
  onNewStepTextChange: (text: string) => void;
  onAddStep: () => void;
}

export const NewStepForm = ({
  newStepText,
  onNewStepTextChange,
  onAddStep,
}: NewStepFormProps) => {
  return (
    <div className="new-step-form">
      <input
        type="text"
        value={newStepText}
        onChange={(e) => onNewStepTextChange(e.target.value)}
        placeholder="New step..."
        className="new-input-name"
        aria-label="New step"
      />
      <Button size="sm" onClick={onAddStep}>
        Add
      </Button>
    </div>
  );
};
