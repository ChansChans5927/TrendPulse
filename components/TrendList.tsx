import React from "react";
import { TrendItem } from "../types";
import { BarChart2 } from "lucide-react";

interface TrendListProps {
  trends: TrendItem[];
  accentColor: string;
}

const TrendList: React.FC<TrendListProps> = ({ trends, accentColor }) => {
  return (
    <div className="space-y-4">
      {trends.map((trend) => (
        <div
          key={trend.rank}
          className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${accentColor === "rose" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}
              >
                {trend.rank}
              </span>
              <div>
                <h3 className="font-semibold text-lg text-slate-100 group-hover:text-white leading-tight">
                  {trend.keyword}
                </h3>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 mt-1 inline-block">
                  {trend.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <BarChart2 className="w-4 h-4" />
              <span className="text-sm font-medium">{trend.volume}</span>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-400 pl-11">
            {trend.description}
          </p>

          <div
            className={`absolute left-0 bottom-0 h-1 rounded-bl-xl rounded-br-xl transition-all duration-500 ${accentColor === "rose" ? "bg-gradient-to-r from-rose-500 to-orange-500" : "bg-gradient-to-r from-emerald-500 to-cyan-500"}`}
            style={{ width: `${trend.volume}%` }}
          />
        </div>
      ))}
    </div>
  );
};

export default TrendList;
