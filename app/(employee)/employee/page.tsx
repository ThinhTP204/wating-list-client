import CalendarPage from "@/app/(features)/features/components/calendar/CalendarPage";
import ShiftSwapPage from "@/app/(employee)/employee/components/shift-swap/ShiftSwapPage";

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  calendar: CalendarPage,
  "shift-swap": ShiftSwapPage,
};

export default async function EmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "calendar" } = await searchParams;
  const Component = TAB_COMPONENTS[tab] ?? CalendarPage;

  return <Component />;
}
