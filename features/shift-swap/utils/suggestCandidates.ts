type ShiftType = "morning" | "afternoon" | "evening" | "night";

export interface ShiftSwapPostInput {
  authorDepartment: string;
  branch: string;
  myShift: {
    date: string;
    type: ShiftType;
  };
}

export interface AvailableEmployeeInput {
  id: string;
  name: string;
  department: string;
  branch: string;
  isOnline: boolean;
  karma: number;
  availableDate: string;
  availableShifts: ShiftType[];
  isOwn?: boolean;
}

export interface CandidateSuggestion {
  employee: AvailableEmployeeInput;
  score: number;
  reasons: string[];
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function isSameDay(left: string, right: string): boolean {
  const l = new Date(left);
  const r = new Date(right);

  if (Number.isNaN(l.getTime()) || Number.isNaN(r.getTime())) {
    return left.slice(0, 10) === right.slice(0, 10);
  }

  return (
    l.getFullYear() === r.getFullYear() &&
    l.getMonth() === r.getMonth() &&
    l.getDate() === r.getDate()
  );
}

export function buildCandidateSuggestions(
  post: ShiftSwapPostInput,
  candidates: AvailableEmployeeInput[],
  limit = 3
): CandidateSuggestion[] {
  const results = candidates
    .filter((candidate) => !candidate.isOwn)
    .map((candidate) => {
      let score = 0;
      const reasons: string[] = [];

      if (isSameDay(candidate.availableDate, post.myShift.date)) {
        score += 25;
        reasons.push("Trung ngay can doi");
      }

      if (candidate.availableShifts.includes(post.myShift.type)) {
        score += 35;
        reasons.push("Co san dung loai ca");
      }

      if (candidate.branch === post.branch) {
        score += 15;
        reasons.push("Cung chi nhanh");
      }

      if (candidate.department === post.authorDepartment) {
        score += 10;
        reasons.push("Cung phong ban");
      }

      if (candidate.isOnline) {
        score += 5;
        reasons.push("Dang online");
      }

      const karmaBonus = Math.min(10, Math.max(0, candidate.karma / 10));
      score += karmaBonus;
      if (candidate.karma >= 85) {
        reasons.push("Do tin cay cao");
      }

      return {
        employee: candidate,
        score: clampScore(score),
        reasons,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.employee.karma !== a.employee.karma) {
        return b.employee.karma - a.employee.karma;
      }
      return Number(b.employee.isOnline) - Number(a.employee.isOnline);
    });

  return results.slice(0, limit);
}
