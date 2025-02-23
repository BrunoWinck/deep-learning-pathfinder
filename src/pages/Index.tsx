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
        <div className="column2">
          <div className="widget widget1">
            <LearningPathsWidget />
          </div>
          <div className="widget widget4">
            <SearchDebugWidget />
          </div>
        </div>
        <div className="column2">
          <div className="widget widget2">
            <AIDebugWidget />
          </div>
          <div className="widget widget3">
            <ChatWidget />
          </div>
        </div>
        <div className="column2">
          <div className="widget widget5">
            <LearningStatementsWidget />
          </div>
        </div>
      </DashboardLayout>
    </AppProvider>;
};
export default Index;