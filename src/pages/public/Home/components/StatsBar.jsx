const StatsBar = () => {
    const stats = [
        { value: "12.4K+", label: "Estudiantes activos" },
        { value: "480+", label: "Roadmaps publicados" },
        { value: "94%", label: "Tasa de satisfacción" },
    ];

    return (
        <div className="relative z-20 -mt-10 sm:-mt-14 md:-mt-16 flex justify-center px-4 sm:px-8 md:px-12">
            <div className="w-full max-w-4xl grid grid-cols-3 gap-0.5 rounded-2xl md:rounded-3xl p-1 sm:p-1.5">
                {stats.map((stat, index) => {
                    const isFirst = index === 0;
                    const isLast = index === stats.length - 1;

                    return (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center justify-center gap-1 sm:gap-2 py-5 sm:py-8 md:py-10 px-1.5 sm:px-4 text-center bg-[#252525] hover:bg-[#DDEAFF] group transition-all duration-300 cursor-default
                                ${isFirst ? "rounded-l-xl sm:rounded-l-2xl" : ""}
                                ${isLast ? "rounded-r-xl sm:rounded-r-2xl" : ""}
                            `}
                        >
                            <span className="text-xl sm:text-3xl md:text-4xl font-bold font-fraunces text-white group-hover:text-black transition-colors duration-300">
                                {stat.value}
                            </span>
                            <span className="text-[11px] sm:text-sm md:text-base text-gray-400 group-hover:text-gray-700 font-outfit leading-tight">
                                {stat.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatsBar;