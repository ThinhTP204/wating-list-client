import FeaturesSectionDemo from "@/components/features-section-demo-2";

export default function Blog() {
  return (
    <section id="blog" className="w-full bg-white scroll-mt-16">
      <div className="relative z-20 mx-auto max-w-7xl py-10 lg:py-40">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500">
            Con số ấn tượng
          </span>
          <h4 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
            Lợi ích{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold">
              thực tế
            </span>{" "}
            khi dùng Wokki
          </h4>
          <p className="mx-auto my-4 max-w-2xl text-center text-sm font-normal text-neutral-500 lg:text-base dark:text-neutral-300">
            Dựa trên dữ liệu nghiên cứu thị trường và kết quả vận hành — đây là
            những con số mà Wokki mang lại cho doanh nghiệp của bạn.
          </p>
        </div>

        <FeaturesSectionDemo />
      </div>
    </section>
  );
}

