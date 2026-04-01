import EmployeeCalendarPage from "@/features/employee-calendar/components/EmployeeCalendarPage";
import ShiftSwapPage from "@/app/(employee)/employee/components/shift-swap/ShiftSwapPage";
import EarningsPage from "@/app/(employee)/employee/components/earnings/EarningsPage";
import ChatPage from "@/app/(features)/features/components/chat/ChatPage";

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  calendar: EmployeeCalendarPage,
  "shift-swap": ShiftSwapPage,
  earnings: EarningsPage,
  chat: ChatPage,
};

export default async function EmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "calendar" } = await searchParams;
  const Component = TAB_COMPONENTS[tab] ?? EmployeeCalendarPage;

  return <Component />;
}
