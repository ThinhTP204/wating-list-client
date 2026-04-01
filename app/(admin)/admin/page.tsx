import DashboardPage from "@/app/(admin)/admin/components/dashboard/DashboardPage";
import CalendarPage from "@/app/(features)/features/components/calendar/CalendarPage";
import EmployeesPage from "@/app/(admin)/admin/components/employees/EmployeesPageWrapper";
import TimeKeepingPage from "@/app/(admin)/admin/components/time-keeping/TimeKeepingPage";
import RequestPage from "@/app/(admin)/admin/components/request/RequestPage";
import SalaryPage from "@/app/(admin)/admin/components/salary/SalaryPage";
import ChatPage from "@/app/(features)/features/components/chat/ChatPage";

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  calendar: CalendarPage,
  employees: EmployeesPage,
  "time-keeping": TimeKeepingPage,
  request: RequestPage,
  salary: SalaryPage,
  chat: ChatPage,
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "dashboard" } = await searchParams;
  const Component = TAB_COMPONENTS[tab] ?? DashboardPage;

  return <Component />;
}
