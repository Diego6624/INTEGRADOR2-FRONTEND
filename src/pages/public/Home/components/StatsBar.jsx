const StatsBar = () => {
    const stats = [
        { value: "12.4K+", label: "Estudiantes activos" },
        { value: "480+", label: "Roadmaps publicados" },
        { value: "94%", label: "Tasa de satisfacción" },
    ];

    return (
        <div className="relative z-20 -mt-16 flex justify-center px-8 md:px-40">
            <div className="w-full max-w-4xl grid grid-cols-3 md:gap-0.5">
                <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center bg-[#252525] hover:bg-[#DDEAFF] group transition duration-300 rounded-2xl md:rounded-bl-2xl md:rounded-tl-2xl md:rounded-none shadow-xl cursor-default">
                    <span className="text-2xl md:text-4xl font-bold font-fraunces text-white group-hover:text-[#000000] transition duration-300">
                        12.4K+
                    </span>
                    <span className="text-sm md:text-lg text-gray-400 group-hover:text-[#606060] font-outfit">
                        Estudiantes activos
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center bg-[#252525] hover:bg-[#DDEAFF] group transition duration-300 rounded-2xl md:rounded-none shadow-xl cursor-default">
                    <span className="text-2xl md:text-4xl font-bold font-fraunces text-white group-hover:text-[#000000] transition duration-300">
                        480+
                    </span>
                    <span className="text-sm md:text-lg text-gray-400 group-hover:text-[#606060] font-outfit">
                        Roadmaps publicados
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center bg-[#252525] hover:bg-[#DDEAFF] group transition duration-300 rounded-2xl md:rounded-br-2xl md:rounded-tr-2xl md:rounded-none shadow-xl cursor-default">
                    <span className="text-2xl md:text-4xl font-bold font-fraunces text-white group-hover:text-[#000000] transition duration-300">
                        94%
                    </span>
                    <span className="text-sm md:text-lg text-gray-400 group-hover:text-[#606060] font-outfit">
                        Tasa de satisfacción
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatsBar;