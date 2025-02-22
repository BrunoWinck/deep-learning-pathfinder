
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="bg-blue-100 rounded-lg p-4">Widget 1</div>
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-lg p-4">Widget 2</div>
        <div className="bg-orange-100 rounded-lg p-4">Widget 3</div>
      </div>
      <div className="space-y-4">
        <div className="bg-green-100 rounded-lg p-4">Widget 4</div>
        <div className="bg-violet-100 rounded-lg p-4">Widget 5</div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
