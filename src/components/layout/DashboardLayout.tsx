
import { TitleBar } from "./TitleBar";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dashboard-layout">
      <TitleBar />
      <div className="-columns">
        {children}
      </div>
    </div>
  );
};
