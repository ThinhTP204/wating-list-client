import { cn } from "@/lib/utils";
import {
  IconClockHour4,
  IconAlertTriangle,
  IconTrendingDown,
  IconMoodSmile,
  IconChartPie,
  IconCurrencyDollar,
  IconUsers,
  IconRocket,
} from "@tabler/icons-react";

const features = [
  {
    title: "Tiết kiệm 85% thời gian xếp ca",
    description:
      "AI tự động phân ca trong vài giây — quản lý không còn mất hàng giờ mỗi tuần để lập lịch thủ công.",
    icon: <IconClockHour4 />,
    stat: "85%",
  },
  {
    title: "Giảm 95% sai sót phân ca",
    description:
      "Loại bỏ trùng ca, thiếu người giờ cao điểm — hệ thống ràng buộc cứng đảm bảo không bao giờ sai sót.",
    icon: <IconAlertTriangle />,
    stat: "95%",
  },
  {
    title: "Giảm 40% chi phí nhân sự",
    description:
      "Tối ưu hoá số giờ công, giảm lãng phí nhân lực và kiểm soát chi phí làm thêm giờ hiệu quả.",
    icon: <IconCurrencyDollar />,
    stat: "40%",
  },
  {
    title: "Tăng 3x tốc độ lấp ca trống",
    description:
      "Sàn đổi ca + AI Matchmaking giúp tìm người thay thế tức thì — không còn ca bị bỏ trống.",
    icon: <IconRocket />,
    stat: "3x",
  },
  {
    title: "323,000+ cửa hàng F&B",
    description:
      "Thị trường mục tiêu lớn với hơn 323 ngàn cửa hàng F&B tại Việt Nam — tất cả đều cần quản lý ca.",
    icon: <IconUsers />,
    stat: "323K",
  },
  {
    title: "Tỷ lệ nghỉ việc giảm 60%",
    description:
      "Phân ca công bằng, minh bạch và tôn trọng sở thích — nhân viên hài lòng hơn, gắn bó lâu hơn.",
    icon: <IconTrendingDown />,
    stat: "60%",
  },
  {
    title: "98% nhân viên hài lòng",
    description:
      "Tự chủ đổi ca, xem lương real-time và giao tiếp trực tiếp trong app — trải nghiệm nhân viên số 1.",
    icon: <IconMoodSmile />,
    stat: "98%",
  },
  {
    title: "ROI sau 6 tháng",
    description:
      "Tiết kiệm 30–50% chi phí hành chính, hoàn vốn chỉ sau 6-8 tháng triển khai nền tảng.",
    icon: <IconChartPie />,
    stat: "6th",
  },
];

export default function FeaturesSectionDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  stat,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  stat: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-200 dark:border-neutral-800 transition-all duration-300",
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b"
      )}
    >
      {/* Hover background gradient */}
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-emerald-50/80 via-emerald-50/30 to-transparent dark:from-emerald-950/40 dark:via-emerald-950/10 pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-emerald-50/80 via-emerald-50/30 to-transparent dark:from-emerald-950/40 dark:via-emerald-950/10 pointer-events-none" />
      )}

      {/* Stat badge */}
      <div className="absolute top-4 right-6 z-10">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent opacity-30 group-hover/feature:opacity-100 transition-opacity duration-300">
          {stat}
        </span>
      </div>

      {/* Icon */}
      <div className="mb-4 relative z-10 px-10 text-neutral-400 group-hover/feature:text-emerald-500 transition-colors duration-300">
        {icon}
      </div>

      {/* Title with accent bar */}
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-gradient-to-b group-hover/feature:from-emerald-400 group-hover/feature:to-cyan-400 transition-all duration-300 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-300 inline-block text-neutral-800 dark:text-neutral-100 group-hover/feature:text-emerald-700 dark:group-hover/feature:text-emerald-300">
          {title}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs relative z-10 px-10 group-hover/feature:text-neutral-700 dark:group-hover/feature:text-neutral-200 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};
