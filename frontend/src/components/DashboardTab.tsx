import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BIDashboardData } from '../types';
import { 
  BarChart3, TrendingUp, Filter, Users, Briefcase, 
  Building2, DollarSign, Layers, Info, RefreshCw, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, CartesianGrid, Legend
} from 'recharts';

export const DashboardTab: React.FC = () => {
  const [data, setData] = useState<BIDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBIDashboard();
      setData(res);
    } catch (err: any) {
      setError('Không thể tải dữ liệu Dashboard BI từ Backend FastAPI.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Đang tổng hợp dữ liệu BI từ SQLite...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl space-y-2">
        <div className="flex items-center space-x-2 font-bold">
          <AlertCircle className="w-5 h-5" />
          <span>Lỗi kết nối</span>
        </div>
        <p className="text-sm">{error || 'Không có dữ liệu.'}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

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
            Tổng hợp dữ liệu thời gian thực từ Backend FastAPI và Cơ sở dữ liệu SQLite
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 self-start sm:self-center transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng ứng viên</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.total_candidates}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Hồ sơ sẵn sàng</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tin tuyển dụng</span>
            <Briefcase className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.total_jobs}</p>
          <span className="text-[11px] text-teal-600 font-medium">Đang mở tuyển</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Nhà tuyển dụng</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.total_employers}</p>
          <span className="text-[11px] text-indigo-600 font-medium">Doanh nghiệp</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng đơn ứng tuyển</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.total_applications}</p>
          <span className="text-[11px] text-amber-600 font-medium">Đang trong phễu</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lương trung vị</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{data.avg_market_salary_mid} <span className="text-sm font-normal text-slate-500">tr</span></p>
          <span className="text-[11px] text-slate-500">Triệu VNĐ/tháng</span>
        </div>
      </div>

      {/* 3 NHÓM BIỂU ĐỒ THEO ĐÚNG CHECKLIST 3 */}

      {/* NHÓM 1: Số lượng ứng viên theo kỹ năng */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <span>Nhóm 1 — Số lượng ứng viên theo kỹ năng (Top Skills)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Phản ánh mức độ dồi dào của nguồn nhân lực theo từng công nghệ chuyên môn
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 self-start">
            Recharts BarChart
          </span>
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
                tick={{ fontSize: 11, fill: '#475569' }} 
                angle={-25} 
                textAnchor="end"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip 
                formatter={(val: any) => [`${val} ứng viên`, 'Số lượng']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="candidate_count" fill="#0d9488" radius={[6, 6, 0, 0]} name="Số ứng viên" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NHÓM 2: Xu hướng mức lương theo thời gian */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis unit=" tr" tick={{ fontSize: 11, fill: '#475569' }} />
              <Tooltip 
                formatter={(val: any) => [`${val} triệu VNĐ`, '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
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
                dot={{ r: 3 }}
                name="Lương tối đa (Max)"
              />
              <Line 
                type="monotone" 
                dataKey="avg_salary_min" 
                stroke="#f59e0b" 
                strokeDasharray="4 4" 
                dot={{ r: 3 }}
                name="Lương tối thiểu (Min)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chú thích rõ ràng theo yêu cầu Checklist 3 */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start space-x-2 text-xs text-blue-800">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <span>{data.salary_notes}</span>
        </div>
      </div>

      {/* NHÓM 3: Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Nhóm 3 — Tỷ lệ chuyển đổi qua các giai đoạn tuyển dụng (Phễu tuyển dụng)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Đo lường tính hiệu quả của quy trình lọc hồ sơ, phỏng vấn và nhận việc (Recruitment Funnel)
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 self-start">
            Recharts Funnel / Conversion
          </span>
        </div>

        {/* Các mốc phễu hiển thị trực quan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.funnel_stages.map((stage, idx) => (
            <div 
              key={stage.stage_key} 
              className={`p-4 rounded-xl border relative overflow-hidden ${
                idx === 0 ? 'bg-indigo-50/50 border-indigo-200' :
                idx === 1 ? 'bg-blue-50/50 border-blue-200' :
                idx === 2 ? 'bg-teal-50/50 border-teal-200' :
                'bg-emerald-50/50 border-emerald-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-700">{stage.stage_name}</span>
                <span className="text-xs px-2 py-0.5 bg-white rounded-full font-bold shadow-xs">
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
                <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 font-medium">
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
              margin={{ top: 10, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#475569' }} />
              <YAxis 
                type="category" 
                dataKey="stage_name" 
                tick={{ fontSize: 11, fill: '#475569' }} 
                width={140}
              />
              <Tooltip 
                formatter={(val: any, name: string) => [
                  name === 'conversion_rate_from_applied' ? `${val}% (lũy tiến)` : `${val} đơn`,
                  name === 'conversion_rate_from_applied' ? 'Tỷ lệ chuyển đổi' : 'Số lượng'
                ]}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar 
                dataKey="conversion_rate_from_applied" 
                fill="#4f46e5" 
                radius={[0, 6, 6, 0]} 
                name="Tỷ lệ chuyển đổi (%)" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <strong>* Nguyên tắc tính toán phễu:</strong> Dữ liệu chuyển đổi được ghi nhận dựa trên mô hình phễu nhất quán 
          (Ứng viên đạt đến vòng <em>Nhận việc</em> bắt buộc đã trải qua vòng <em>Phỏng vấn</em>, <em>Duyệt hồ sơ</em> và <em>Nộp hồ sơ</em>). 
          Không lấy các trạng thái cô lập để tránh sai lệch tỷ lệ chuyển đổi thực tế.
        </div>
      </div>
    </div>
  );
};
