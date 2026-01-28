import React, { useState, useEffect } from 'react';
import { fetchTrends } from './services/geminiService';
import { Region, TrendResponse } from './types';
import TrendChart from './components/TrendChart';
import TrendList from './components/TrendList';
import { RefreshCw, Globe, MapPin, ExternalLink, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [koreaData, setKoreaData] = useState<TrendResponse | null>(null);
  const [globalData, setGlobalData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch concurrently for speed
      const [koreaRes, globalRes] = await Promise.all([
        fetchTrends(Region.KOREA),
        fetchTrends(Region.GLOBAL)
      ]);
      setKoreaData(koreaRes);
      setGlobalData(globalRes);
    } catch (err: any) {
      setError(err.message || "트렌드 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            TrendPulse
          </h1>
          <p className="text-slate-400 mt-1">Gemini Grounding 기반 실시간 시장 인사이트</p>
        </div>
        <button
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 rounded-full font-medium transition-all text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>분석 새로고침</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            오류: {error} Gemini API 키와 인터넷 연결을 확인해주세요.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Korea Column */}
          <section className="bg-slate-900/50 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-500/10 rounded-xl">
                <MapPin className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">대한민국</h2>
                <p className="text-sm text-slate-400">국내 실시간 트렌드</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                 <div className="h-64 bg-slate-800/50 rounded-xl w-full"></div>
                 <div className="h-24 bg-slate-800/50 rounded-xl w-full"></div>
                 <div className="h-24 bg-slate-800/50 rounded-xl w-full"></div>
                 <div className="h-24 bg-slate-800/50 rounded-xl w-full"></div>
              </div>
            ) : koreaData ? (
              <>
                <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 mb-6">
                   <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">검색량 분석</h3>
                   <TrendChart data={koreaData.trends} color="#f43f5e" />
                </div>
                <TrendList trends={koreaData.trends} accentColor="rose" />
                
                {/* Sources Footer */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">검증된 출처</h4>
                  <div className="flex flex-wrap gap-2">
                    {koreaData.sources.length > 0 ? (
                      koreaData.sources.map((source, idx) => (
                        <a 
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/5 hover:bg-rose-500/10 px-2 py-1 rounded border border-rose-500/10 transition-colors"
                        >
                          {source.title.slice(0, 20)}... <ExternalLink className="w-3 h-3" />
                        </a>
                      ))
                    ) : (
                      <span className="text-xs text-slate-600">관련 출처 링크가 없습니다.</span>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </section>

          {/* Global Column */}
          <section className="bg-slate-900/50 rounded-3xl">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Globe className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">글로벌</h2>
                <p className="text-sm text-slate-400">전 세계 실시간 트렌드</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                 <div className="h-64 bg-slate-800/50 rounded-xl w-full"></div>
                 <div className="h-24 bg-slate-800/50 rounded-xl w-full"></div>
                 <div className="h-24 bg-slate-800/50 rounded-xl w-full"></div>
                 <div className="h-24 bg-slate-800/50 rounded-xl w-full"></div>
              </div>
            ) : globalData ? (
              <>
                 <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 mb-6">
                   <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">검색량 분석</h3>
                   <TrendChart data={globalData.trends} color="#10b981" />
                </div>
                <TrendList trends={globalData.trends} accentColor="emerald" />
                
                {/* Sources Footer */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">검증된 출처</h4>
                  <div className="flex flex-wrap gap-2">
                    {globalData.sources.length > 0 ? (
                      globalData.sources.map((source, idx) => (
                        <a 
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/5 hover:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/10 transition-colors"
                        >
                          {source.title.slice(0, 20)}... <ExternalLink className="w-3 h-3" />
                        </a>
                      ))
                    ) : (
                      <span className="text-xs text-slate-600">관련 출처 링크가 없습니다.</span>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;