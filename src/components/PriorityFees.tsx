import { useContext } from "react";
import { AppContext } from "../context/App-Context";

const PriorityFees = () => {
  const ctx = useContext(AppContext);
  return (
    <div className="my-4">
      <h2>Priority Fees</h2>

      <div className="flex flex-wrap gap-3 mt-4 ">
        <button
          className={`${ctx.priority == "none" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
          onClick={() => ctx.setPriority("none")}
        >
          <p>None</p>
        </button>
        <button
          className={`${ctx.priority == "low" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
          onClick={() => ctx.setPriority("low")}
        >
          <p>Low</p>
        </button>
        <button
          className={`${ctx.priority == "medium" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
          onClick={() => ctx.setPriority("medium")}
        >
          <p>Medium</p>
        </button>
        <button
          className={`${ctx.priority == "high" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
          onClick={() => ctx.setPriority("high")}
        >
          <p>High</p>
        </button>
        <button
          className={`${ctx.priority == "veryHigh" ? "bg-[#0d48a1d3] text-slate-200" : "bg-[#0D47A114] text-[#0D47A1A3]"} border border-[#032E703D] p-1 px-2 rounded-md text-[14px]`}
          onClick={() => ctx.setPriority("veryHigh")}
        >
          <p>Very High</p>
        </button>
      </div>
    </div>
  );
};

export default PriorityFees;
