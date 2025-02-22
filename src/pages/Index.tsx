import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LearningPathsWidget } from "@/components/widgets/LearningPathsWidget";
import { AIDebugWidget } from "@/components/widgets/AIDebugWidget";
import { ChatWidget } from "@/components/widgets/ChatWidget";
import { SearchDebugWidget } from "@/components/widgets/SearchDebugWidget";
import { LearningStatementsWidget } from "@/components/widgets/LearningStatementsWidget";
import { AppProvider } from "@/contexts/AppContext";
const Index = () => {
  return <AppProvider>
      <DashboardLayout>
        <div className="bg-blue-100 rounded-lg p-4">
          <LearningPathsWidget />
        </div>
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 h-[400px]">
            <AIDebugWidget />
          </div>
          <div className="bg-orange-100 rounded-lg p-4 flex-1">
            <ChatWidget />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-green-100 rounded-lg p-4 h-[200px]">
            <SearchDebugWidget />
          </div>
          <div className="bg-violet-100 rounded-lg p-4 flex-1">
            <LearningStatementsWidget />
          </div>
        </div>
      </DashboardLayout>
    </AppProvider>;
};
export default Index;