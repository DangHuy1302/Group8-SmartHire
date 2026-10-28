import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SystemStats } from '../types';
import { 
  Database, Users, Building2, Briefcase, Award, 
  Layers, CheckCircle, Server, Monitor, FileSpreadsheet,
  ArrowRight, ShieldCheck, Sparkles, RefreshCw
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
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold text-teal-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thực hành Hệ thống Kinh doanh Thông minh (TH3) — Group 8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SmartHire Mini — Hệ thống tìm việc thông minh tích hợp AI và BI
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Dự án thực nghiệm hoàn chỉnh giải quyết bài toán tuyển dụng hiện đại: sử dụng mô hình học máy 
              (TF-IDF kết hợp Cosine Similarity và từ điển kỹ năng chuẩn hóa) để tính Matching Score khách quan giữa 
              CV và Job Description; đồng thời cung cấp Dashboard BI trực quan hóa phân bố nhân lực, xu hướng lương và phễu tuyển dụng.
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="self-start md:self-center inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-lg border border-white/20 transition-all"
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
          <span className="text-xs text-slate-500">Dữ liệu nạp từ seed_data.py có thể tái lập 100%</span>
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
              <span><strong>AI CV Matching:</strong> Trích xuất kỹ năng bằng bộ từ điển Regex, vector hóa TF-IDF, tính Cosine Similarity và kết hợp tỷ lệ kỹ năng tạo Matching Score (0–100).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Dashboard BI:</strong> Trực quan hóa 3 nhóm số liệu (phân bố kỹ năng, xu hướng lương theo thời gian và phễu tuyển dụng nhất quán).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Kiểm thử & Đánh giá:</strong> Chạy test tự động và đánh giá chỉ số thực nghiệm Precision, Recall, F1 trên 12 cặp gán nhãn thực tế.</span>
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
              <span><strong>Thời gian đáp ứng:</strong> Thời gian phân tích CV dưới 500ms, không phụ thuộc vào kết nối mạng bên ngoài.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <span><strong>Độc lập & Gọn nhẹ:</strong> Sử dụng SQLite dạng file nhúng, chạy ngay trên Windows chỉ với 1 file script `start.bat`.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <span><strong>Tính nhất quán cao:</strong> Vectorizer được fit trước trên tập tham chiếu nền, đảm bảo kết quả so khớp ổn định và có thể tái lập.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <span><strong>Đúng checklist:</strong> Không tạo tính năng dư thừa ngoài đề (không đăng nhập, chatbot, thanh toán hay gọi API bên thứ ba).</span>
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
              <div>• 7 Bảng quan hệ chuẩn</div>
              <div>• Seed data có thể tái lập</div>
              <div>• Không cần cấu hình server DB</div>
              <div>• Tự động index khóa chính/ngoại</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sơ đồ thực thể liên kết (ERD) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <Database className="w-5 h-5 text-teal-600" />
            <span>Sơ đồ Thực thể Liên kết (Entity Relationship Diagram - ERD)</span>
          </h3>
          <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            7 Thực thể quan hệ chuẩn hóa
          </span>
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
              <div>name: VARCHAR(100)</div>
              <div>industry: VARCHAR(100)</div>
              <div>location: VARCHAR(100)</div>
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
              <div>full_name: VARCHAR(100)</div>
              <div>email: VARCHAR(100) [UK]</div>
              <div>phone: VARCHAR(20)</div>
              <div>years_of_experience: INT</div>
              <div>current_title: VARCHAR(100)</div>
              <div>cv_text: TEXT</div>
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
              <div className="text-blue-600">🔗 employer_id: INT [FK]</div>
              <div>title: VARCHAR(150)</div>
              <div>description: TEXT</div>
              <div>salary_min / max: FLOAT</div>
              <div>posted_date: DATE</div>
              <div>status: VARCHAR(20)</div>
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
              <div>name: VARCHAR(50) [UK]</div>
              <div>category: VARCHAR(50)</div>
            </div>
          </div>

          {/* Table: candidate_skills */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
              <span>candidate_skills</span>
              <span className="text-slate-400 font-normal">N - N Ứng viên - Kỹ năng</span>
            </div>
            <div className="p-3 bg-white space-y-1.5 font-mono">
              <div className="text-amber-600 font-bold">🔑 candidate_id [PK, FK]</div>
              <div className="text-amber-600 font-bold">🔑 skill_id [PK, FK]</div>
              <div>proficiency_level: INT</div>
            </div>
          </div>

          {/* Table: job_skills */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-800 text-white font-bold px-3 py-2 flex justify-between">
              <span>job_skills</span>
              <span className="text-slate-400 font-normal">N - N Công việc - Kỹ năng</span>
            </div>
            <div className="p-3 bg-white space-y-1.5 font-mono">
              <div className="text-amber-600 font-bold">🔑 job_id [PK, FK]</div>
              <div className="text-amber-600 font-bold">🔑 skill_id [PK, FK]</div>
              <div>is_required: BOOLEAN</div>
            </div>
          </div>

          {/* Table: applications */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs md:col-span-2 lg:col-span-3">
            <div className="bg-teal-800 text-white font-bold px-3 py-2 flex justify-between">
              <span>applications</span>
              <span className="text-teal-200 font-normal">Đơn ứng tuyển & Lịch sử phễu</span>
            </div>
            <div className="p-3 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 font-mono">
              <div className="text-amber-600 font-bold">🔑 id: INTEGER [PK]</div>
              <div className="text-blue-600">🔗 candidate_id: INT [FK]</div>
              <div className="text-blue-600">🔗 job_id: INT [FK]</div>
              <div>stage: VARCHAR(30)</div>
              <div>applied_date: DATETIME</div>
              <div>match_score: FLOAT</div>
              <div className="col-span-2">notes: TEXT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
