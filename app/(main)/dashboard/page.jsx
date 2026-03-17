import { getIndustrialInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./components/dashboard-view";

const IndustryInsights = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  console.log(isOnboarded)
  // console.log(insights)
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  const insights = await getIndustrialInsights();
  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsights;
