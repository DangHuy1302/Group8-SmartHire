import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { JobSimple, JobDetail, CandidateSimple, MatchResponse } from '../types';
import { 
  Sparkles, CheckCircle, XCircle, ArrowRight, 
  HelpCircle, Sliders, FileText, Briefcase, Zap, AlertCircle
} from 'lucide-react';

export const MatchingTab: React.FC = () => {
  const [jobs, setJobs] = useState<JobSimple[]>([]);
  const [candidates, setCandidates] = useState<CandidateSimple[]>([]);
  
  const [selectedJobId, setSelectedJobId] = useState<number | ''>('');
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobDetail | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | ''>('');
  
  const [cvText, setCvText] = useState<string>('');
  const [weightTfidf, setWeightTfidf] = useState<number>(0.6);
  const [weightSkills, setWeightSkills] = useState<number>(0.4);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách jobs và candidates khi mở tab
  useEffect(() => {
    const initData = async () => {
      try {
        const [jobsData, candsData] = await Promise.all([
          api.getJobs(),
          api.getCandidates()
        ]);
        setJobs(jobsData);
        setCandidates(candsData);
        if (jobsData.length > 0) {
          setSelectedJobId(jobsData[0].id);
        }
      } catch (err) {
        setError('Không thể tải danh sách JD và Ứng viên từ Backend.');
      }
    };
    initData();
  }, []);

  // Khi chọn Job -> tải chi tiết Job
  useEffect(() => {
    if (selectedJobId) {
      api.getJobDetail(Number(selectedJobId)).then(setSelectedJobDetail).catch(console.error);
    }
  }, [selectedJobId]);

  // Khi người dùng chọn ứng viên mẫu -> tự động điền CV text
  const handleSelectCandidate = async (candId: number) => {
    setSelectedCandidateId(candId);
    if (!candId) return;
    try {
      const detail = await api.getCandidateDetail(candId);
      setCvText(detail.cv_text);
    } catch (err) {
      console.error(err);
    }
  };

  // Gọi API phân tích Matching
  const handleAnalyze = async () => {
    if (!selectedJobId) {
      setError('Vui lòng chọn một tin tuyển dụng (Job Description).');
      return;
    }
    if (!cvText.trim()) {
      setError('Vui lòng nhập nội dung CV hoặc chọn một ứng viên mẫu.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.analyzeMatch({
        job_id: Number(selectedJobId),
        cv_text: cvText,
        weight_tfidf: weightTfidf,
        weight_skills: weightSkills
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Lỗi khi gọi API phân tích Matching.');
    } finally {
      setLoading(false);
    }
  };

  // Đổi trọng số TF-IDF -> tự động cân đối trọng số Kỹ năng
  const handleTfidfWeightChange = (newVal: number) => {
    const tfidf = Math.round(newVal * 10) / 10;
    const skills = Math.round((1.0 - tfidf) * 10) / 10;
    setWeightTfidf(tfidf);
    setWeightSkills(skills);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Tiêu đề & Giải thích mô hình */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-teal-700">
          <Zap className="w-5 h-5" />
          <h2 className="text-xl font-bold">Mô hình AI CV Matching (TF-IDF & Skill Taxonomy)</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Hệ thống sử dụng kỹ thuật <strong>TF-IDF (Term Frequency - Inverse Document Frequency)</strong> kết hợp 
          đo khoảng cách góc <strong>Cosine Similarity</strong> trên không gian từ vựng tham chiếu chuẩn (60%) 
          và đối sánh <strong>Từ điển kỹ năng chuẩn hóa</strong> (40%). 
          Mọi phép tính được thực thi trực tiếp trên backend FastAPI bằng thư viện <code>scikit-learn</code>.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid điều khiển và nhập liệu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI: Chọn JD và Điều chỉnh Trọng số */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Chọn Job Description */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <label className="block text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-teal-600" />
              <span>1. Chọn tin tuyển dụng (Job Description)</span>
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  #{job.id} — {job.title} ({job.salary_min}-{job.salary_max} tr/tháng)
                </option>
              ))}
            </select>

            {/* Chi tiết JD đã chọn */}
            {selectedJobDetail && (
              <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Công ty: </span>
                  <span className="text-teal-700 font-medium">{selectedJobDetail.employer_name}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Kinh nghiệm: </span>
                  <span>Tối thiểu {selectedJobDetail.min_experience_years} năm</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Mô tả công việc: </span>
                  <p className="text-slate-600 mt-0.5">{selectedJobDetail.description}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Kỹ năng yêu cầu: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedJobDetail.required_skills.map((sk) => (
                      <span key={sk} className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Cấu hình trọng số Matching */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                <span>2. Trọng số thử nghiệm</span>
              </label>
              <span className="text-xs text-slate-500">Mặc định: 60% / 40%</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>TF-IDF Cosine Similarity (Ngữ nghĩa):</span>
                  <span className="font-bold text-teal-700">{Math.round(weightTfidf * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  value={weightTfidf}
                  onChange={(e) => handleTfidfWeightChange(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1">
                  <span>Skill Match Ratio (Kỹ năng cốt lõi):</span>
                  <span className="font-bold text-teal-700">{Math.round(weightSkills * 100)}%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic bg-amber-50 p-2.5 rounded border border-amber-200">
                * Giải thích: Tỷ lệ 60% ngữ nghĩa văn bản và 40% kỹ năng là lựa chọn thiết kế ban đầu để vừa 
                đánh giá toàn diện kinh nghiệm mô tả trong CV, vừa đảm bảo ứng viên bắt buộc phải nắm các công nghệ then chốt.
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Nhập/Chọn CV và Nút Phân tích */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>3. Nội dung CV ứng viên</span>
              </label>

              {/* Dropdown chọn nhanh ứng viên mẫu */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 whitespace-nowrap">Mẫu có sẵn:</span>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => handleSelectCandidate(Number(e.target.value))}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">-- Chọn ứng viên mẫu --</option>
                  {candidates.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      {cand.full_name} ({cand.current_title})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              rows={9}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Nhập hoặc dán nội dung văn bản CV vào đây (hoặc chọn ứng viên mẫu ở trên)... Ví dụ: Kỹ sư Backend 3 năm kinh nghiệm lập trình Python, FastAPI, Docker, PostgreSQL..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-sans focus:ring-2 focus:ring-teal-500 focus:outline-none focus:bg-white transition-all"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tính toán trên FastAPI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Phân tích mức độ phù hợp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* HIỂN THỊ KẾT QUẢ PHÂN TÍCH (NẾU ĐÃ TÍNH TOÁN) */}
      {result && (
        <div className="bg-white rounded-2xl border-2 border-teal-500 p-6 shadow-md space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div>
              <span className="text-xs uppercase font-bold text-teal-600 tracking-wider">Kết quả AI Matching</span>
              <h3 className="text-xl font-extrabold text-slate-800">
                So khớp với: {result.job_title} ({result.employer_name})
              </h3>
            </div>
            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start">
              Trọng số: TF-IDF {Math.round(weightTfidf * 100)}% + Kỹ năng {Math.round(weightSkills * 100)}%
            </div>
          </div>

          {/* 3 Đồng hồ số đo điểm số */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Matching Score tổng hợp */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 text-center space-y-2">
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wide">Điểm phù hợp tổng hợp (Score)</p>
              <div className="text-4xl sm:text-5xl font-black text-teal-700">
                {result.matching_score}%
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.matching_score >= 70 ? 'bg-teal-600' :
                    result.matching_score >= 45 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${result.matching_score}%` }}
                />
              </div>
            </div>

            {/* TF-IDF Cosine Similarity */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Tương đồng ngữ nghĩa (TF-IDF)</p>
              <div className="text-3xl font-extrabold text-blue-600">
                {result.tfidf_similarity}%
              </div>
              <p className="text-[11px] text-slate-500">Đo bằng Cosine Similarity trên tập từ vựng chuẩn</p>
            </div>

            {/* Skill Match Ratio */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Tỷ lệ kỹ năng đáp ứng</p>
              <div className="text-3xl font-extrabold text-indigo-600">
                {result.skill_match_ratio}%
              </div>
              <p className="text-[11px] text-slate-500">
                Khớp {result.matched_skills.length} / {result.required_job_skills.length} kỹ năng yêu cầu
              </p>
            </div>
          </div>

          {/* Nhận xét định tính */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-700">Đánh giá hệ thống:</span>
            <p className="text-sm font-medium text-slate-800">{result.evaluation_comment}</p>
          </div>

          {/* Chi tiết kỹ năng phù hợp & kỹ năng còn thiếu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kỹ năng phù hợp */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Kỹ năng phù hợp ({result.matched_skills.length})</span>
              </div>
              {result.matched_skills.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Không có kỹ năng nào trùng khớp với JD.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {result.matched_skills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-md text-xs font-semibold"
                    >
                      <span>✓ {skill}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Kỹ năng còn thiếu */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Kỹ năng còn thiếu theo yêu cầu JD ({result.missing_skills.length})</span>
              </div>
              {result.missing_skills.length === 0 ? (
                <p className="text-xs text-emerald-700 font-medium">Ứng viên đáp ứng đầy đủ tất cả kỹ năng yêu cầu!</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {result.missing_skills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center space-x-1 bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-md text-xs font-semibold"
                    >
                      <span>✕ {skill}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
