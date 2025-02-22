
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
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={newStepText}
        onChange={(e) => onNewStepTextChange(e.target.value)}
        placeholder="New step..."
        className="flex-1 p-2 rounded border"
        aria-label="New step"
      />
      <Button size="sm" onClick={onAddStep}>
        Add
      </Button>
    </div>
  );
};
