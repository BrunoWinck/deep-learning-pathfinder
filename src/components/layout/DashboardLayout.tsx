
import { TitleBar } from "./TitleBar";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TitleBar />
      <div className="flex-1 grid grid-cols-3 gap-4 p-4">
        {children}
      </div>
    </div>
  );
};
