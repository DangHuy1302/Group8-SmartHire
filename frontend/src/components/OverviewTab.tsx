import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SystemStats } from '../types';
import { 
  Database, Users, Building2, Briefcase, Award, 
  Layers, CheckCircle, Server, Monitor, FileSpreadsheet,
  ArrowRight, ShieldCheck, Sparkles, RefreshCw, GitBranch,
  Key, Link2
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSystemOverview();
      setStats(data);
    } catch (err: any) {
      setError('Không thể kết nối Backend FastAPI. Vui lòng đảm bảo backend đang chạy tại port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Giới thiệu đề tài */}
      <div className="bg-gradient-to-r from-teal-800 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-teal-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 px-3 py-1 rounded-full text-xs font-semibold text-teal-300 uppercase tracking-wider border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Thực hành Hệ thống Kinh doanh Thông minh (TH3) — Group 8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SmartHire Mini — Hệ thống tìm việc thông minh tích hợp AI và BI
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Giải pháp tuyển dụng kết hợp hai trụ cột: <strong>Mô hình học máy AI (TF-IDF + Cosine Similarity)</strong> định lượng 
              mức độ tương thích giữa CV và tin tuyển dụng (Job Description); cùng <strong>Dashboard BI</strong> cung cấp thông tin quản trị 
              về phân bố kỹ năng, xu hướng tiền lương và phễu tuyển dụng đa tầng.
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="self-start md:self-center inline-flex items-center space-x-2 bg-teal-600/30 hover:bg-teal-600/50 text-teal-200 text-xs px-3.5 py-2.5 rounded-lg border border-teal-500/40 transition-all font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Đồng bộ DB</span>
          </button>
        </div>
      </div>

      {/* 2. Thống kê số lượng bản ghi thực tế trong SQLite Database */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <Database className="w-5 h-5 text-teal-600" />
            <span>Thống kê thực tế trong Cơ sở dữ liệu SQLite (smarthire.db)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Bộ dữ liệu mẫu được khởi tạo bằng seed cố định, giúp kết quả thử nghiệm nhất quán giữa các lần chạy.
          </span>
        </div>

        {error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Ứng viên (Candidates)</p>
                <p className="text-xl font-bold text-slate-800">{loading ? '...' : stats?.total_candidates}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Nhà tuyển dụng</p>
                <p className="text-xl font-bold text-slate-800">{loading ? '...' : stats?.total_employers}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Tin tuyển dụng (Jobs)</p>
                <p className="text-xl font-bold text-slate-800">{loading ? '...' : stats?.total_jobs}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Đơn ứng tuyển (Apps)</p>
                <p className="text-xl font-bold text-slate-800">{loading ? '...' : stats?.total_applications}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Kỹ năng chuẩn hóa</p>
                <p className="text-xl font-bold text-slate-800">{loading ? '...' : stats?.total_skills}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Phân tích yêu cầu chức năng & phi chức năng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-teal-600" />
            <span>Yêu cầu chức năng chính</span>
          </h3>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Quản lý dữ liệu mẫu:</strong> Lưu trữ ứng viên, nhà tuyển dụng, tin tuyển dụng, kỹ năng và đơn ứng tuyển.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>AI CV Matching:</strong> Trích xuất kỹ năng bằng bộ từ điển Regex, vector hóa TF-IDF trên tập tham chiếu nền, đo Cosine Similarity và kết hợp tỷ lệ kỹ năng tạo Matching Score (0–100).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Dashboard BI:</strong> Trực quan hóa 3 nhóm số liệu trọng tâm: phân bố kỹ năng, xu hướng lương theo thời gian và phễu tuyển dụng nhất quán.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Kiểm thử & Đánh giá:</strong> Chạy 12 bài test tự động và đánh giá chỉ số thực nghiệm Precision, Recall, F1 trên tập benchmark 12 cặp gán nhãn.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Yêu cầu phi chức năng & Phạm vi thiết kế</span>
          </h3>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <span><strong>Mục tiêu thiết kế hiệu năng:</strong> Hướng tới thời gian phản hồi phân tích CV dưới 500ms trong điều kiện máy tính cá nhân tiêu chuẩn.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <span><strong>Tính độc lập & Gọn nhẹ:</strong> Sử dụng SQLite dạng file nhúng, chạy ngay trên Windows chỉ với script `start.bat`.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <span><strong>Tính nhất quán cao:</strong> Vectorizer được fit trước trên tập tham chiếu nền, bảo đảm tính ổn định và khách quan của trọng số IDF.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <span><strong>Đúng checklist:</strong> Tập trung giải quyết trọn vẹn yêu cầu bài thực hành TH3, không thêm tính năng ngoài đề.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Sơ đồ kiến trúc hệ thống */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <span>Sơ đồ kiến trúc hệ thống 3 tầng (System Architecture)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          {/* Frontend Layer */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 mx-auto rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Frontend Layer</h4>
            <p className="text-xs text-slate-500">React + TypeScript + Vite + Tailwind CSS</p>
            <div className="text-left text-xs bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1">
              <div>• Màn 1: Tổng quan & ERD</div>
              <div>• Màn 2: AI CV Matching</div>
              <div>• Màn 3: Dashboard BI (Recharts)</div>
              <div>• Màn 4: Test & Evaluation</div>
            </div>
          </div>

          {/* Backend Layer */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3 relative">
            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Backend & ML Layer</h4>
            <p className="text-xs text-slate-500">FastAPI + Scikit-learn + SQLAlchemy</p>
            <div className="text-left text-xs bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1">
              <div>• REST API (/api/v1)</div>
              <div>• TF-IDF Vectorizer + Cosine Sim</div>
              <div>• Regex Skill Extractor</div>
              <div>• BI Calculation Service</div>
            </div>
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Data Layer */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Data Persistence Layer</h4>
            <p className="text-xs text-slate-500">SQLite Database (smarthire.db)</p>
            <div className="text-left text-xs bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1">
              <div>• 7 Bảng quan hệ chuẩn hóa</div>
              <div>• Khởi tạo bằng seed cố định</div>
              <div>• File nhúng, không cần cấu hình server</div>
              <div>• Index khóa chính / khóa ngoại</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SƠ ĐỒ ERD TRỰC QUAN CÓ ĐƯỜNG NỐI QUAN HỆ & BỘI SỐ (CHECKLIST 1 NÂNG CẤP) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-teal-600" />
              <span>Sơ đồ Quan hệ Thực thể Trực quan (Interactive Visual ERD)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mô tả trực quan mối liên kết, đường nối quan hệ và bội số 1–N, N–N giữa 7 thực thể CSDL
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1 text-slate-600">
              <Key className="w-3.5 h-3.5 text-amber-500" /> <span>PK: Khóa chính</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-600">
              <Link2 className="w-3.5 h-3.5 text-blue-500" /> <span>FK: Khóa ngoại</span>
            </span>
          </div>
        </div>

        {/* DIAGRAM FLOW TRỰC QUAN CÂN ĐỐI */}
        <div className="bg-slate-900 rounded-xl p-6 text-white overflow-x-auto shadow-inner border border-slate-800">
          <div className="min-w-[820px] max-w-5xl mx-auto space-y-6">
            
            {/* Hàng 1: Employers và Candidates */}
            <div className="grid grid-cols-2 gap-12">
              {/* Box 1: employers */}
              <div className="bg-slate-800 border-2 border-emerald-500/60 rounded-xl p-4 shadow-md space-y-2">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="font-bold text-emerald-400 text-sm">employers (Nhà tuyển dụng)</span>
                  <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Bảng chính</span>
                </div>
                <div className="text-xs font-mono space-y-1 text-slate-300">
                  <div className="text-amber-400 font-semibold">🔑 id: INTEGER [PK]</div>
                  <div>name: VARCHAR(100)</div>
                  <div>industry: VARCHAR(100)</div>
                  <div>location: VARCHAR(100)</div>
                </div>
              </div>

              {/* Box 2: candidates */}
              <div className="bg-slate-800 border-2 border-blue-500/60 rounded-xl p-4 shadow-md space-y-2">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="font-bold text-blue-400 text-sm">candidates (Ứng viên)</span>
                  <span className="text-[11px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">Bảng chính</span>
                </div>
                <div className="text-xs font-mono space-y-1 text-slate-300">
                  <div className="text-amber-400 font-semibold">🔑 id: INTEGER [PK]</div>
                  <div>full_name: VARCHAR(100)</div>
                  <div>email: VARCHAR(100) [UK]</div>
                  <div>current_title: VARCHAR(100)</div>
                </div>
              </div>
            </div>

            {/* Đường nối hàng 1 xuống hàng 2 */}
            <div className="grid grid-cols-2 gap-12 text-center text-xs text-slate-400 font-mono">
              <div className="flex flex-col items-center">
                <span className="bg-slate-800 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40 shadow-xs">
                  (1) ↓ đăng tuyển ↓ (N)
                </span>
                <div className="w-0.5 h-6 bg-emerald-500/60" />
              </div>
              <div className="flex flex-col items-center">
                <span className="bg-slate-800 text-blue-300 px-3 py-1 rounded-full border border-blue-500/40 shadow-xs">
                  (1) ↓ nộp đơn ↓ (N)
                </span>
                <div className="w-0.5 h-6 bg-blue-500/60" />
              </div>
            </div>

            {/* Hàng 2: jobs và applications */}
            <div className="grid grid-cols-2 gap-12">
              {/* Box 3: jobs */}
              <div className="bg-slate-800 border-2 border-teal-500/60 rounded-xl p-4 shadow-md space-y-2">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="font-bold text-teal-400 text-sm">jobs (Tin tuyển dụng)</span>
                  <span className="text-[11px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800">Quan hệ 1-N</span>
                </div>
                <div className="text-xs font-mono space-y-1 text-slate-300">
                  <div className="text-amber-400 font-semibold">🔑 id: INTEGER [PK]</div>
                  <div className="text-cyan-400 font-semibold">🔗 employer_id: INT [FK → employers.id]</div>
                  <div>title: VARCHAR(150)</div>
                  <div>salary_min / max: FLOAT</div>
                </div>
              </div>

              {/* Box 4: applications */}
              <div className="bg-slate-800 border-2 border-indigo-500/60 rounded-xl p-4 shadow-md space-y-2">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="font-bold text-indigo-400 text-sm">applications (Đơn ứng tuyển)</span>
                  <span className="text-[11px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">Điểm hội tụ</span>
                </div>
                <div className="text-xs font-mono space-y-1 text-slate-300">
                  <div className="text-amber-400 font-semibold">🔑 id: INTEGER [PK]</div>
                  <div className="text-cyan-400 font-semibold">🔗 candidate_id: INT [FK → candidates.id]</div>
                  <div className="text-cyan-400 font-semibold">🔗 job_id: INT [FK → jobs.id]</div>
                  <div>stage: VARCHAR(30) | match_score: FLOAT</div>
                </div>
              </div>
            </div>

            {/* Đường nối ngang: Jobs (1) -> (N) Applications */}
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-center text-xs text-slate-300">
              <span className="text-teal-400 font-semibold">jobs</span>
              <span className="mx-2 text-slate-400 font-mono">── (1) nhận đơn ──► (N)</span>
              <span className="text-indigo-400 font-semibold">applications</span>
              <span className="mx-4 text-slate-500">|</span>
              <span className="text-slate-400">Một công việc có thể nhận nhiều đơn ứng tuyển từ các ứng viên khác nhau.</span>
            </div>

            {/* Hàng 3: Bảng kỹ năng và Bảng nối N-N */}
            <div className="pt-2 border-t border-slate-800 space-y-4">
              <div className="text-center">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Mô hình liên kết Nhiều - Nhiều (N - N) với Bảng kỹ năng chuẩn hóa (skills)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Box 5: job_skills */}
                <div className="bg-slate-800 border border-teal-500/40 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                    <span className="font-bold text-teal-300 text-xs">job_skills</span>
                    <span className="text-[10px] text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded">Bảng nối N–N</span>
                  </div>
                  <div className="text-[11px] font-mono space-y-1 text-slate-300">
                    <div className="text-amber-400 font-semibold">🔑🔗 job_id [PK, FK]</div>
                    <div className="text-amber-400 font-semibold">🔑🔗 skill_id [PK, FK]</div>
                    <div>is_required: BOOLEAN</div>
                  </div>
                </div>

                {/* Box 6: skills (Trung tâm) */}
                <div className="bg-slate-800 border-2 border-amber-500/70 rounded-xl p-3.5 space-y-1.5 shadow-lg">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                    <span className="font-bold text-amber-400 text-xs">skills (Danh mục kỹ năng)</span>
                    <span className="text-[10px] text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded">Từ điển chuẩn</span>
                  </div>
                  <div className="text-[11px] font-mono space-y-1 text-slate-300">
                    <div className="text-amber-400 font-semibold">🔑 id: INTEGER [PK]</div>
                    <div>name: VARCHAR(50) [UK]</div>
                    <div>category: VARCHAR(50)</div>
                  </div>
                </div>

                {/* Box 7: candidate_skills */}
                <div className="bg-slate-800 border border-blue-500/40 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                    <span className="font-bold text-blue-300 text-xs">candidate_skills</span>
                    <span className="text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded">Bảng nối N–N</span>
                  </div>
                  <div className="text-[11px] font-mono space-y-1 text-slate-300">
                    <div className="text-amber-400 font-semibold">🔑🔗 candidate_id [PK, FK]</div>
                    <div className="text-amber-400 font-semibold">🔑🔗 skill_id [PK, FK]</div>
                    <div>proficiency_level: INT</div>
                  </div>
                </div>
              </div>

              {/* Giải thích quan hệ N-N */}
              <div className="text-center text-xs text-slate-400 flex justify-around font-mono">
                <span>jobs (1) ── (N) job_skills (N) ── (1) skills</span>
                <span>candidates (1) ── (N) candidate_skills (N) ── (1) skills</span>
              </div>
            </div>

          </div>
        </div>

        {/* 6. Chi tiết thuộc tính và ràng buộc 7 bảng trong SQLite */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Chi tiết các trường dữ liệu, khóa chính và khóa ngoại trong SQLite
            </h4>
            <span className="text-xs text-slate-500">Đã đối chiếu 100% với models.py</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Table: employers */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
                <span>employers</span>
                <span className="text-slate-400 font-normal">Nhà tuyển dụng</span>
              </div>
              <div className="p-3 bg-white space-y-1.5 font-mono">
                <div className="text-amber-600 font-bold">🔑 id: INTEGER [PK]</div>
                <div>name: VARCHAR(100) NOT NULL</div>
                <div>industry: VARCHAR(100) NOT NULL</div>
                <div>location: VARCHAR(100) NOT NULL</div>
                <div>website: VARCHAR(200)</div>
              </div>
            </div>

            {/* Table: candidates */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
                <span>candidates</span>
                <span className="text-slate-400 font-normal">Ứng viên</span>
              </div>
              <div className="p-3 bg-white space-y-1.5 font-mono">
                <div className="text-amber-600 font-bold">🔑 id: INTEGER [PK]</div>
                <div>full_name: VARCHAR(100) NOT NULL</div>
                <div>email: VARCHAR(100) UNIQUE NOT NULL</div>
                <div>phone: VARCHAR(20)</div>
                <div>years_of_experience: INT DEFAULT 0</div>
                <div>current_title: VARCHAR(100) NOT NULL</div>
                <div>cv_text: TEXT NOT NULL</div>
              </div>
            </div>

            {/* Table: jobs */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
                <span>jobs</span>
                <span className="text-slate-400 font-normal">Tin tuyển dụng</span>
              </div>
              <div className="p-3 bg-white space-y-1.5 font-mono">
                <div className="text-amber-600 font-bold">🔑 id: INTEGER [PK]</div>
                <div className="text-blue-600 font-bold">🔗 employer_id: INT [FK → employers.id]</div>
                <div>title: VARCHAR(150) NOT NULL</div>
                <div>description: TEXT NOT NULL</div>
                <div>salary_min / max: FLOAT NOT NULL</div>
                <div>posted_date: DATE</div>
                <div>status: VARCHAR(20) DEFAULT 'Open'</div>
              </div>
            </div>

            {/* Table: skills */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
                <span>skills</span>
                <span className="text-slate-400 font-normal">Kỹ năng chuẩn hóa</span>
              </div>
              <div className="p-3 bg-white space-y-1.5 font-mono">
                <div className="text-amber-600 font-bold">🔑 id: INTEGER [PK]</div>
                <div>name: VARCHAR(50) UNIQUE NOT NULL</div>
                <div>category: VARCHAR(50) NOT NULL</div>
              </div>
            </div>

            {/* Table: candidate_skills */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
                <span>candidate_skills</span>
                <span className="text-slate-400 font-normal">N - N Ứng viên - Kỹ năng</span>
              </div>
              <div className="p-3 bg-white space-y-1.5 font-mono">
                <div className="text-amber-600 font-bold">🔑 candidate_id [PK, FK → candidates.id]</div>
                <div className="text-amber-600 font-bold">🔑 skill_id [PK, FK → skills.id]</div>
                <div>proficiency_level: INT DEFAULT 3</div>
              </div>
            </div>

            {/* Table: job_skills */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
                <span>job_skills</span>
                <span className="text-slate-400 font-normal">N - N Công việc - Kỹ năng</span>
              </div>
              <div className="p-3 bg-white space-y-1.5 font-mono">
                <div className="text-amber-600 font-bold">🔑 job_id [PK, FK → jobs.id]</div>
                <div className="text-amber-600 font-bold">🔑 skill_id [PK, FK → skills.id]</div>
                <div>is_required: BOOLEAN DEFAULT TRUE</div>
              </div>
            </div>

            {/* Table: applications */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs md:col-span-2 lg:col-span-3">
              <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
                <span>applications</span>
                <span className="text-slate-400 font-normal">Đơn ứng tuyển & Lịch sử phễu</span>
              </div>
              <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 font-mono">
                <div className="text-amber-600 font-bold">🔑 id: INTEGER [PK]</div>
                <div className="text-blue-600 font-bold">🔗 candidate_id: INT [FK → candidates.id]</div>
                <div className="text-blue-600 font-bold">🔗 job_id: INT [FK → jobs.id]</div>
                <div>stage: VARCHAR(30) NOT NULL</div>
                <div>applied_date: DATETIME</div>
                <div>match_score: FLOAT</div>
                <div className="col-span-2">notes: TEXT</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
