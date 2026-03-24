import CalendarPage from "./components/calendar/page";
import EmployeesPage from "./components/employees/page";
import TimeKeepingPage from "./components/time-keeping/page";
import RequestPage from "./components/request/page";
import UserRequestPage from "./components/request/user/page";
import SalaryPage from "./components/salary/page";
import TaskPage from "./components/task/page";
import DashboardPage from "./components/dashboard/page";

const tabComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  calendar: CalendarPage,
  employees: EmployeesPage,
  "time-keeping": TimeKeepingPage,
  request: RequestPage,
  "request-user": UserRequestPage,
  salary: SalaryPage,
  task: TaskPage,
};

export default async function FeaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "dashboard" } = await searchParams;
  const Component = tabComponents[tab] ?? DashboardPage;

  return <Component />;
}
