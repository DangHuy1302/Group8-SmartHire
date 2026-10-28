import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BIDashboardData } from '../types';
import { 
  BarChart3, TrendingUp, Filter, Users, Briefcase, 
  Building2, DollarSign, Layers, Info, RefreshCw, AlertCircle,
  Lightbulb, Sparkles, CheckCircle2, Award, PieChart
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, CartesianGrid, Legend,
  ComposedChart
} from 'recharts';

const CATEGORIES = ['All', 'Backend', 'Frontend', 'Database', 'Data/AI', 'DevOps'];

export const DashboardTab: React.FC = () => {
  const [data, setData] = useState<BIDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchDashboardData = async (cat?: string) => {
    try {
      setLoading(true);
      setError(null);
      const categoryParam = cat && cat !== 'All' ? cat : undefined;
      const res = await api.getBIDashboard(categoryParam);
      setData(res);
    } catch (err: any) {
      setError('Không thể tải dữ liệu Dashboard BI từ Backend FastAPI.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Đang tổng hợp dữ liệu BI từ SQLite...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl space-y-2">
        <div className="flex items-center space-x-2 font-bold">
          <AlertCircle className="w-5 h-5" />
          <span>Lỗi kết nối</span>
        </div>
        <p className="text-sm">{error || 'Không có dữ liệu.'}</p>
        <button
          onClick={() => fetchDashboardData(selectedCategory)}
          className="mt-2 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header và nút refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            <span>Dashboard BI — Báo cáo Thông minh Tuyển dụng</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu theo yêu cầu (On-Demand) từ Backend FastAPI và Cơ sở dữ liệu SQLite
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {loading && (
            <span className="text-xs text-teal-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> Đang cập nhật...
            </span>
          )}
          <button
            onClick={() => fetchDashboardData(selectedCategory)}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 self-start sm:self-center transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới dữ liệu</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (5 Thẻ chỉ số quan trọng) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng ứng viên</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.total_candidates}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Hồ sơ sẵn sàng</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tin tuyển dụng</span>
            <Briefcase className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.total_jobs}</p>
          <span className="text-[11px] text-teal-600 font-medium">Đang mở tuyển</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Nhà tuyển dụng</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.total_employers}</p>
          <span className="text-[11px] text-indigo-600 font-medium">Doanh nghiệp</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng đơn ứng tuyển</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.total_applications}</p>
          <span className="text-[11px] text-amber-600 font-medium">Đang trong phễu</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lương thị trường (Mid)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800">{data.avg_market_salary_mid}</span>
            <span className="text-xs text-slate-500 font-normal">tr/tháng</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
            <span>Trung vị:</span>
            <strong className="text-emerald-700">{data.median_salary_mid} tr</strong>
          </div>
        </div>
      </div>

      {/* PHẦN NHẬN XÉT BI TỰ ĐỘNG (AUTOMATED RULE-BASED INSIGHTS) */}
      <div className="bg-linear-to-r from-teal-900 via-slate-900 to-indigo-950 p-5 rounded-2xl text-white shadow-md border border-teal-500/30">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide uppercase text-teal-300">
                Nhận xét BI tự động (Automated Rule-Based Insights)
              </h3>
              <p className="text-[11px] text-slate-300">
                Được sinh tự động từ các quy tắc phân tích trên CSDL SQLite thực tế
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-semibold bg-white/10 text-teal-200 rounded-full border border-teal-400/20">
            Engine: Rule-based Aggregation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.bi_insights && data.bi_insights.length > 0 ? (
            data.bi_insights.map((insight, idx) => (
              <div 
                key={idx}
                className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 flex items-start space-x-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-teal-400/20 text-teal-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {insight}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 col-span-3">Chưa có nhận xét tổng hợp.</p>
          )}
        </div>
      </div>

      {/* 3 NHÓM BIỂU ĐỒ BẮT BUỘC THEO CHECKLIST 3 + BIỂU ĐỒ BỔ SUNG */}

      {/* NHÓM 1: Số lượng ứng viên và Nhu cầu tuyển dụng theo kỹ năng (Top Skills) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <span>Nhóm 1 — Tương quan Cung & Cầu kỹ năng (Supply vs Demand)</span>
            </h3>
            <p className="text-xs text-slate-500">
              So sánh số lượng ứng viên có kỹ năng (Cung) với số lượng việc làm yêu cầu (Cầu)
            </p>
          </div>

          {/* Bộ lọc danh mục kỹ năng tương tác */}
          <div className="flex items-center flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Danh mục:
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === cat 
                    ? 'bg-teal-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
                }`}
              >
                {cat === 'All' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.skill_distribution}
              margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="skill_name" 
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} 
                angle={-25} 
                textAnchor="end"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                formatter={(val: any, name: string) => [
                  `${val} ${name === 'candidate_count' ? 'ứng viên có skill' : 'việc làm yêu cầu'}`,
                  name === 'candidate_count' ? 'Cung (Ứng viên)' : 'Cầu (Việc làm)'
                ]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(value) => value === 'candidate_count' ? 'Cung: Số ứng viên có kỹ năng' : 'Cầu: Số việc làm yêu cầu'}
              />
              <Bar dataKey="candidate_count" fill="#0d9488" radius={[4, 4, 0, 0]} name="candidate_count" />
              <Bar dataKey="job_demand_count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="job_demand_count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start space-x-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Ghi chú quan hệ N-N:</strong> Do một ứng viên hoặc một việc làm có thể sở hữu/yêu cầu nhiều kỹ năng đồng thời, 
            tổng số lượng phân bố kỹ năng không bằng tổng số ứng viên và tổng tỷ lệ phần trăm không nhất thiết là 100%.
          </span>
        </div>
      </div>

      {/* BIỂU ĐỒ BỔ SUNG: PHÂN BỐ VIỆC LÀM & MỨC LƯƠNG THEO CHUYÊN MÔN (DOMAIN STATS) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Phân bố việc làm & Mức lương theo Chuyên môn (Domain Breakdown)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Đánh giá cơ cấu tuyển dụng và mức đãi ngộ trung bình theo 4 nhóm chuyên môn chính
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start">
            Recharts ComposedChart
          </span>
        </div>

        {(() => {
          const domainList = (data.domain_stats || []).map((dom, idx) => ({
            ...dom,
            domain: dom.domain || dom.domain_name || `Chuyên môn ${idx + 1}`,
            domain_name: dom.domain_name || dom.domain || `Chuyên môn ${idx + 1}`,
            top_skills: Array.isArray(dom.top_skills) ? dom.top_skills : []
          }));

          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={domainList}
                    margin={{ top: 20, right: 30, left: 0, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="domain" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      allowDecimals={false} 
                      tick={{ fontSize: 11, fill: '#475569' }} 
                      unit=" jobs"
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      unit=" tr" 
                      tick={{ fontSize: 11, fill: '#059669' }} 
                      domain={[0, 50]}
                    />
                    <Tooltip 
                      formatter={(val: any, name: string) => [
                        name === 'job_count' ? `${val} việc làm` : `${val} triệu VNĐ/tháng`,
                        name === 'job_count' ? 'Số lượng tin tuyển' : 'Lương trung bình (Mid)'
                      ]}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      formatter={(val) => val === 'job_count' ? 'Số lượng tin tuyển dụng (Cột trái)' : 'Lương TB Mid (Đường phải)'}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="job_count" 
                      fill="#6366f1" 
                      radius={[6, 6, 0, 0]} 
                      barSize={38}
                      name="job_count" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="avg_salary_mid" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={{ r: 5, fill: '#10b981' }}
                      name="avg_salary_mid" 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Danh sách thẻ tóm tắt từng chuyên môn */}
              <div className="space-y-2.5">
                {domainList.map((dom) => (
                  <div key={dom.domain} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">{dom.domain}</span>
                      <span className="text-xs font-black text-emerald-700">{dom.avg_salary_mid} tr/tháng</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                      <span>{dom.job_count} việc làm tuyển dụng</span>
                    </div>
                    {dom.top_skills.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {dom.top_skills.map((sk) => (
                          <span key={sk} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* NHÓM 2: Xu hướng mức lương theo thời gian */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Nhóm 2 — Xu hướng mức lương theo thời gian</span>
            </h3>
            <p className="text-xs text-slate-500">
              Mức lương tối thiểu, tối đa và trung vị qua các tháng (05/2026 – 10/2026)
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 self-start">
            Recharts AreaChart
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.salary_trends}
              margin={{ top: 15, right: 20, left: -10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorSalaryMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
              <YAxis unit=" tr" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 45]} />
              <Tooltip 
                formatter={(val: any) => [`${val} triệu VNĐ`, '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area 
                type="monotone" 
                dataKey="avg_salary_mid" 
                stroke="#2563eb" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorSalaryMid)" 
                name="Lương trung bình (Mid)"
              />
              <Line 
                type="monotone" 
                dataKey="avg_salary_max" 
                stroke="#10b981" 
                strokeDasharray="4 4" 
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Lương tối đa (Max)"
              />
              <Line 
                type="monotone" 
                dataKey="avg_salary_min" 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Lương tối thiểu (Min)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg flex items-start space-x-2 text-xs text-blue-900 leading-relaxed">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
          <div>
            <strong>Giải thích công thức toán học & dữ liệu:</strong>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>
                <strong>Lương trung bình thị trường (Mean): {data.avg_market_salary_mid} tr</strong> — Là trung bình cộng số học của điểm giữa khoảng lương <code>(salary_min + salary_max) / 2</code> trên 15 tin tuyển dụng.
              </li>
              <li>
                <strong>Lương trung vị (Median): {data.median_salary_mid} tr</strong> — Là giá trị trung vị đứng ở vị trí giữa của dãy mức lương đã sắp xếp, phản ánh mức lương chuẩn xác không bị méo bởi các tin tuyển dụng cực cao.
              </li>
              <li>
                <strong>Xu hướng theo tháng:</strong> Được trích xuất từ cột <code>created_at</code> của các tin tuyển dụng trong SQLite mô phỏng từ tháng 05/2026 đến tháng 10/2026 nhằm phục vụ minh họa bài thực hành.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* NHÓM 3: Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (Phễu tuyển dụng) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Nhóm 3 — Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (Recruitment Funnel)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Đo lường tính hiệu quả của quy trình lọc hồ sơ, phỏng vấn và nhận việc
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 self-start">
            Recharts Funnel / Conversion
          </span>
        </div>

        {/* 4 Mốc phễu hiển thị trực quan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.funnel_stages.map((stage, idx) => (
            <div 
              key={stage.stage_key} 
              className={`p-4 rounded-xl border relative overflow-hidden ${
                idx === 0 ? 'bg-indigo-50/60 border-indigo-200' :
                idx === 1 ? 'bg-blue-50/60 border-blue-200' :
                idx === 2 ? 'bg-teal-50/60 border-teal-200' :
                'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-700">{stage.stage_name}</span>
                <span className="text-xs px-2 py-0.5 bg-white rounded-full font-bold shadow-2xs border border-slate-200">
                  {stage.count} đơn
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-800">
                  {stage.conversion_rate_from_applied}%
                </div>
                <div className="text-[11px] text-slate-500">So với tổng hồ sơ nộp</div>
              </div>
              {idx > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 font-medium">
                  Tỷ lệ qua vòng: <strong className="text-teal-700">{stage.step_conversion_rate}%</strong>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Biểu đồ thanh ngang biểu diễn tỷ lệ chuyển đổi lũy tiến */}
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.funnel_stages}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis 
                type="category" 
                dataKey="stage_name" 
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} 
                width={150}
              />
              <Tooltip 
                formatter={(val: any, name: string) => [
                  name === 'conversion_rate_from_applied' ? `${val}% (lũy tiến)` : `${val} đơn`,
                  name === 'conversion_rate_from_applied' ? 'Tỷ lệ chuyển đổi' : 'Số lượng'
                ]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
              <Bar 
                dataKey="conversion_rate_from_applied" 
                fill="#4f46e5" 
                radius={[0, 6, 6, 0]} 
                name="conversion_rate_from_applied" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <strong>* Nguyên tắc tính toán phễu:</strong> Dữ liệu chuyển đổi được ghi nhận dựa trên mô hình phễu nhất quán 
          (40 nộp hồ sơ &rarr; 30 qua duyệt hồ sơ &rarr; 16 tiến tới phỏng vấn &rarr; 6 nhận việc). 
          Ứng viên đạt đến vòng <em>Nhận việc</em> bắt buộc đã trải qua các vòng trước đó, bảo đảm tính logic thống kê chặt chẽ.
        </div>
      </div>
    </div>
  );
};
