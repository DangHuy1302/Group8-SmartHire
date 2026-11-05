import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  JobSimple, JobDetail, CandidateSimple, MatchResponse, 
  CustomJobMatchRequest, SkillGapItem, CVSectionRecommendation 
} from '../types';
import { 
  Sparkles, CheckCircle, CheckCircle2, XCircle, ArrowRight, 
  Sliders, FileText, Briefcase, Zap, AlertCircle, Clock,
  UploadCloud, FileUp, Layers, ChevronDown, ChevronUp,
  BookOpen, Award, Lightbulb, AlertTriangle, Plus, X,
  ExternalLink, RotateCcw, Check, Info
} from 'lucide-react';

const POPULAR_SKILL_SUGGESTIONS = [
  'Python', 'FastAPI', 'React', 'TypeScript', 'Docker',
  'PostgreSQL', 'SQL', 'Git', 'Kubernetes', 'CI/CD',
  'Node.js', 'Next.js', 'Tailwind CSS', 'AWS', 'Linux'
];

export const MatchingTab: React.FC = () => {
  // Dữ liệu danh mục từ API
  const [jobs, setJobs] = useState<JobSimple[]>([]);
  const [candidates, setCandidates] = useState<CandidateSimple[]>([]);
  
  // Chế độ JD: 'sample' (15 JD mẫu) hoặc 'custom' (nhập JD tùy chỉnh)
  const [jdMode, setJdMode] = useState<'sample' | 'custom'>('sample');

  // Trạng thái cho JD mẫu
  const [selectedJobId, setSelectedJobId] = useState<number | ''>('');
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobDetail | null>(null);

  // Trạng thái cho JD tùy chỉnh
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customEmployer, setCustomEmployer] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [customSource, setCustomSource] = useState<string>('');

  // Trạng thái ứng viên & văn bản CV
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | ''>('');
  const [cvText, setCvText] = useState<string>('');

  // Trạng thái tải lên tệp CV (PDF/DOCX)
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trọng số Matching (Mặc định 60% TF-IDF, 40% Kỹ năng)
  const [weightTfidf, setWeightTfidf] = useState<number>(0.6);
  const [weightSkills, setWeightSkills] = useState<number>(0.4);

  // Trạng thái kết quả & lỗi
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái thu gọn/mở rộng Outline CV
  const [isOutlineOpen, setIsOutlineOpen] = useState<boolean>(true);

  // Tải danh sách JD và ứng viên mẫu khi mở trang
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
        setError('Không thể tải danh sách JD và Ứng viên từ Backend FastAPI. Vui lòng kiểm tra cổng 8000.');
      }
    };
    initData();
  }, []);

  // Tải chi tiết JD mẫu khi thay đổi lựa chọn
  useEffect(() => {
    if (jdMode === 'sample' && selectedJobId) {
      api.getJobDetail(Number(selectedJobId)).then(setSelectedJobDetail).catch(console.error);
    }
  }, [selectedJobId, jdMode]);

  // Khi người dùng chọn ứng viên mẫu -> tự động điền văn bản CV
  const handleSelectCandidate = async (candId: number) => {
    setSelectedCandidateId(candId);
    if (!candId) return;
    try {
      const detail = await api.getCandidateDetail(candId);
      setCvText(detail.cv_text);
      setUploadedFileName(null);
      setUploadSuccessMsg(`Đã nạp hồ sơ mẫu: ${detail.full_name} (${detail.current_title})`);
      setError(null);
    } catch (err) {
      setError('Không thể lấy chi tiết CV ứng viên từ server.');
    }
  };

  // Xử lý tải tệp CV (PDF / DOCX)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.docx')) {
      setError('Định dạng tệp không được hỗ trợ. Vui lòng chỉ chọn tệp PDF (.pdf) hoặc Word (.docx).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Dung lượng tệp vượt quá giới hạn 10MB. Vui lòng chọn tệp nhỏ hơn.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setUploadingFile(true);
      setError(null);
      setUploadSuccessMsg(null);

      const res = await api.extractCVText(file);
      setCvText(res.text);
      setUploadedFileName(file.name);
      setSelectedCandidateId(''); // Bỏ chọn candidate mẫu nếu có
      setUploadSuccessMsg(`Đã trích xuất thành công ${res.word_count} từ (${res.char_count} ký tự) từ file ${res.filename}. Bạn có thể chỉnh sửa văn bản bên dưới trước khi phân tích.`);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err.message || 'Lỗi khi trích xuất văn bản từ tệp.';
      setError(msg);
      setUploadedFileName(null);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Thêm kỹ năng vào JD tùy chỉnh
  const handleAddCustomSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !customSkills.includes(trimmed)) {
      setCustomSkills([...customSkills, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveCustomSkill = (skillToRemove: string) => {
    setCustomSkills(customSkills.filter((s) => s !== skillToRemove));
  };

  // Xử lý phím Enter trong ô nhập kỹ năng
  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill(customSkillInput);
    }
  };

  // Cân đối thanh trượt trọng số (TF-IDF và Kỹ năng)
  const handleTfidfWeightChange = (newVal: number) => {
    const tfidf = Math.round(newVal * 10) / 10;
    const skills = Math.round((1.0 - tfidf) * 10) / 10;
    setWeightTfidf(tfidf);
    setWeightSkills(skills);
  };

  // Gọi API phân tích Matching (JD mẫu hoặc JD tùy chỉnh)
  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      setError('Vui lòng nhập nội dung văn bản CV, tải file PDF/DOCX hoặc chọn một ứng viên mẫu để phân tích.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (jdMode === 'sample') {
        if (!selectedJobId) {
          setError('Vui lòng chọn một tin tuyển dụng (Job Description) từ danh sách mẫu.');
          setLoading(false);
          return;
        }

        const res = await api.analyzeMatch({
          job_id: Number(selectedJobId),
          cv_text: cvText,
          weight_tfidf: weightTfidf,
          weight_skills: weightSkills
        });
        setResult(res);
      } else {
        // Chế độ JD tùy chỉnh
        if (!customTitle.trim()) {
          setError('Vui lòng nhập Tên vị trí tuyển dụng cho JD tùy chỉnh.');
          setLoading(false);
          return;
        }
        if (!customDesc.trim()) {
          setError('Vui lòng nhập Mô tả yêu cầu công việc cho JD tùy chỉnh.');
          setLoading(false);
          return;
        }

        const reqPayload: CustomJobMatchRequest = {
          cv_text: cvText,
          job_title: customTitle.trim(),
          employer_name: customEmployer.trim() || 'Doanh nghiệp tùy chỉnh',
          description: customDesc.trim(),
          required_skills: customSkills,
          source_url: customSource.trim() || undefined,
          weight_tfidf: weightTfidf,
          weight_skills: weightSkills
        };

        const res = await api.analyzeCustomMatch(reqPayload);
        setResult(res);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Lỗi khi gọi API phân tích Matching từ FastAPI. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Tiêu đề & Giải thích mô hình */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-teal-700">
          <Zap className="w-5 h-5" />
          <h2 className="text-xl font-bold">Mô hình AI CV Matching & Phân tích Skill Gaps</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Hệ thống kết hợp thuật toán <strong>TF-IDF & Cosine Similarity</strong> trên tập văn bản tham chiếu chuẩn (60%) 
          với <strong>Từ điển kỹ năng chuẩn hóa</strong> (40%). 
          Hỗ trợ tải tệp CV thực tế (PDF/DOCX), nhập JD tùy chỉnh của riêng bạn, tự động định vị <strong>Skill Gaps</strong> 
          và đề xuất <strong>Tái cấu trúc Outline CV</strong> mà không dùng mô hình ngôn ngữ lớn (LLM) giả tạo.
        </p>
      </div>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700 text-xs font-semibold ml-2 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Grid 2 cột: Vị trí tuyển dụng & Nội dung CV */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (5 Cột): Chọn JD hoặc Nhập JD tùy chỉnh & Cấu hình trọng số */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card chọn / nhập JD */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <label className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>1. Vị trí tuyển dụng (JD)</span>
              </label>
              <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setJdMode('sample'); setError(null); }}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    jdMode === 'sample' 
                      ? 'bg-white text-teal-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  JD mẫu (15)
                </button>
                <button
                  type="button"
                  onClick={() => { setJdMode('custom'); setError(null); }}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    jdMode === 'custom' 
                      ? 'bg-white text-teal-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Nhập JD của bạn
                </button>
              </div>
            </div>

            {/* CHẾ ĐỘ 1: Chọn JD mẫu từ Database */}
            {jdMode === 'sample' ? (
              <div className="space-y-3">
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

                {selectedJobDetail && (
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Doanh nghiệp: </span>
                      <span className="text-teal-700 font-bold">{selectedJobDetail.employer_name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Kinh nghiệm: </span>
                      <span>Tối thiểu {selectedJobDetail.min_experience_years} năm</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Mô tả công việc: </span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{selectedJobDetail.description}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Kỹ năng bắt buộc ({selectedJobDetail.required_skills.length}): </span>
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
            ) : (
              /* CHẾ ĐỘ 2: Nhập JD tùy chỉnh của người dùng */
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên vị trí tuyển dụng <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="VD: Senior React Frontend Developer"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên công ty tuyển dụng</label>
                  <input
                    type="text"
                    value={customEmployer}
                    onChange={(e) => setCustomEmployer(e.target.value)}
                    placeholder="VD: FPT Software / Công ty Khởi nghiệp AI"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mô tả & Yêu cầu công việc <span className="text-rose-500">*</span></label>
                  <textarea
                    rows={4}
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder="Dán nội dung JD: Trách nhiệm chính, yêu cầu công nghệ, kỹ năng mong muốn..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kỹ năng yêu cầu trọng tâm</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={handleSkillInputKeyDown}
                      placeholder="Gõ kỹ năng rồi Enter hoặc bấm Thêm..."
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomSkill(customSkillInput)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs transition-colors"
                    >
                      Thêm
                    </button>
                  </div>

                  {/* Kỹ năng đã thêm */}
                  {customSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {customSkills.map((sk) => (
                        <span key={sk} className="inline-flex items-center space-x-1 bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                          <span>{sk}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveCustomSkill(sk)}
                            className="hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Gợi ý kỹ năng phổ biến để bấm nhanh */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium">Bấm nhanh: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {POPULAR_SKILL_SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleAddCustomSkill(s)}
                          disabled={customSkills.includes(s)}
                          className="px-1.5 py-0.5 bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-800 text-[10px] rounded border border-slate-200 disabled:opacity-40"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nguồn JD (Tùy chọn)</label>
                  <input
                    type="text"
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    placeholder="VD: TopCV / LinkedIn / https://vietnamworks.com/..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card Trọng số thử nghiệm */}
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
                  <span>Độ tương đồng văn bản (TF-IDF + Cosine Similarity):</span>
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
                  <span>Tỷ lệ kỹ năng đáp ứng (Skill Match Ratio):</span>
                  <span className="font-bold text-teal-700">{Math.round(weightSkills * 100)}%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic bg-amber-50 p-2.5 rounded border border-amber-200 leading-relaxed">
                * Thiết kế thử nghiệm: 60% tương đồng văn bản TF-IDF đo lường ngữ cảnh kinh nghiệm tổng quan; 
                40% kỹ năng đảm bảo ứng viên bao phủ các công nghệ cốt lõi của JD.
              </p>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (7 Cột): Nhập/Tải CV và Nút Phân tích */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <label className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>3. Nội dung CV ứng viên</span>
              </label>

              {/* Nút tải tệp CV & Dropdown chọn mẫu */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Ẩn file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  title="Tải lên tệp CV dạng PDF hoặc Word .docx"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{uploadingFile ? 'Đang trích xuất...' : 'Tải CV (PDF/DOCX)'}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <span className="text-[11px] text-slate-400">hoặc:</span>
                  <select
                    value={selectedCandidateId}
                    onChange={(e) => handleSelectCandidate(Number(e.target.value))}
                    className="p-1 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-500 max-w-[170px] truncate"
                  >
                    <option value="">-- Mẫu có sẵn (20) --</option>
                    {candidates.map((cand) => (
                      <option key={cand.id} value={cand.id}>
                        {cand.full_name} ({cand.current_title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Thông báo trạng thái tải file */}
            {uploadSuccessMsg && (
              <div className="p-2.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </div>
                {uploadedFileName && (
                  <span className="font-mono text-[10px] bg-teal-100 px-2 py-0.5 rounded text-teal-900 shrink-0 ml-2">
                    {uploadedFileName}
                  </span>
                )}
              </div>
            )}

            {/* Textarea nội dung CV */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Văn bản CV sau khi trích xuất hoặc dán trực tiếp:</span>
                <span className="font-mono">
                  {cvText.length} ký tự | {cvText.trim() ? cvText.trim().split(/\s+/).length : 0} từ
                </span>
              </div>
              <textarea
                rows={11}
                value={cvText}
                onChange={(e) => {
                  setCvText(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Nhập hoặc dán nội dung văn bản CV vào đây, hoặc nhấn nút 'Tải CV (PDF/DOCX)' ở trên để trích xuất văn bản từ tệp máy tính... Ví dụ: Kỹ sư Backend 3 năm kinh nghiệm lập trình Python, FastAPI, Docker, PostgreSQL, xây dựng RESTful API..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans focus:ring-2 focus:ring-teal-500 focus:outline-none focus:bg-white transition-all leading-relaxed"
              />
            </div>

            {/* Nút xóa nhanh văn bản nếu cần */}
            {cvText.trim() && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setCvText('');
                    setUploadedFileName(null);
                    setUploadSuccessMsg(null);
                  }}
                  className="inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa nội dung</span>
                </button>
              </div>
            )}

            {/* Nút kích hoạt phân tích */}
            <button
              onClick={handleAnalyze}
              disabled={loading || uploadingFile}
              className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tính toán trên FastAPI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Phân tích mức độ phù hợp & Skill Gaps</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* HIỂN THỊ KẾT QUẢ PHÂN TÍCH (NẾU ĐÃ TÍNH TOÁN) */}
      {result && (
        <div className="bg-white rounded-2xl border-2 border-teal-500 p-6 shadow-md space-y-6 animate-in fade-in duration-300">
          {/* Header kết quả */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold text-teal-600 tracking-wider">Kết quả AI Matching</span>
                {result.is_custom_jd && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                    JD Tùy chỉnh
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
                {result.job_title} — <span className="text-slate-600 font-semibold">{result.employer_name}</span>
              </h3>
            </div>
            <div className="flex items-center space-x-2 self-start flex-wrap gap-1">
              {result.inference_time_ms !== undefined && (
                <span className="inline-flex items-center space-x-1 text-xs text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full font-mono">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Inference: {result.inference_time_ms} ms</span>
                </span>
              )}
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Trọng số: {Math.round(weightTfidf * 100)}% TF-IDF + {Math.round(weightSkills * 100)}% Kỹ năng
              </span>
            </div>
          </div>

          {/* 3 Đồng hồ số đo điểm số */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Matching Score tổng hợp */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 text-center space-y-2">
              <p className="text-xs font-bold text-teal-800 uppercase tracking-wide">Matching Score tổng hợp</p>
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

            {/* Độ tương đồng văn bản TF-IDF */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Độ tương đồng văn bản (TF-IDF)</p>
              <div className="text-3xl font-extrabold text-blue-600">
                {result.tfidf_similarity}%
              </div>
              <p className="text-[11px] text-slate-500">Đo bằng Cosine Similarity trên tập từ vựng chuẩn</p>
            </div>

            {/* Tỷ lệ kỹ năng đáp ứng */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Tỷ lệ kỹ năng đáp ứng</p>
              <div className="text-3xl font-extrabold text-indigo-600">
                {result.skill_match_ratio}%
              </div>
              <p className="text-[11px] text-slate-500">
                Khớp {(result.matched_skills || []).length} / {(result.required_job_skills || []).length} kỹ năng yêu cầu
              </p>
            </div>
          </div>

          {/* Nhận xét định tính */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-700">Đánh giá hệ thống:</span>
            <p className="text-sm font-medium text-slate-800">{result.evaluation_comment}</p>
          </div>

          {/* Chi tiết kỹ năng phù hợp & kỹ năng chưa tìm thấy minh chứng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kỹ năng phù hợp */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Kỹ năng phù hợp ({(result.matched_skills || []).length})</span>
              </div>
              {(result.matched_skills || []).length === 0 ? (
                <p className="text-xs text-slate-500 italic">Chưa nhận diện được kỹ năng nào trùng khớp với JD.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(result.matched_skills || []).map((skill) => (
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

            {/* Kỹ năng chưa được nhận diện trong CV so với JD */}
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Kỹ năng chưa nhận diện trong CV ({(result.missing_skills || []).length})</span>
              </div>
              {(result.missing_skills || []).length === 0 ? (
                <p className="text-xs text-emerald-700 font-medium">Toàn bộ kỹ năng yêu cầu đều đã có minh chứng trong CV!</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(result.missing_skills || []).map((skill) => (
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

          {/* MỤC NÂNG CẤP: PHÂN TÍCH KHOẢNG TRỐNG KỸ NĂNG (SKILL GAPS ANALYSIS) */}
          <div className="p-5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-teal-300 tracking-wide uppercase">
                    Phân tích khoảng trống kỹ năng (Skill Gaps Analysis)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Xác định các kỹ năng trọng tâm chưa thể hiện trong CV và định hướng giải pháp
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                Rule-based Knowledge Base
              </span>
            </div>

            {/* Danh sách Skill Gaps */}
            {result.skill_gaps && result.skill_gaps.length > 0 ? (
              <div className="space-y-3">
                {result.skill_gaps.map((gap: SkillGapItem, idx: number) => (
                  <div 
                    key={gap.skill_name}
                    className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 pb-1.5 border-b border-slate-700/60">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <strong className="text-sm text-amber-300 font-bold">{gap.skill_name}</strong>
                      </div>
                      <span className="text-[10px] bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-800/50">
                        {gap.status_label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] leading-relaxed">
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">📌 Tầm quan trọng với JD:</span>
                        <p className="text-slate-200">{gap.importance}</p>
                      </div>
                      <div>
                        <span className="text-teal-400 font-semibold block mb-0.5">💡 Nếu đã có trải nghiệm thực tế:</span>
                        <p className="text-slate-200">{gap.evidence_suggestion}</p>
                      </div>
                      <div>
                        <span className="text-blue-400 font-semibold block mb-0.5">📚 Hướng học tập & thực hành:</span>
                        <p className="text-slate-200">{gap.learning_path}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center space-x-3 text-xs text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Hồ sơ hoàn hảo về mặt kỹ năng:</strong> Toàn bộ các kỹ năng yêu cầu trong tin tuyển dụng 
                  đều đã được nhận diện minh chứng trong văn bản CV của bạn!
                </span>
              </div>
            )}

            <div className="text-[10px] text-slate-400 italic pt-1">
              * Ghi chú học thuật: Hệ thống sử dụng quy tắc 'Chưa tìm thấy minh chứng trong CV', không khẳng định ứng viên hoàn toàn chưa biết công nghệ này.
            </div>
          </div>

          {/* MỤC NÂNG CẤP: GỢI Ý TÁI CẤU TRÚC OUTLINE CV (COLLAPSIBLE) */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setIsOutlineOpen(!isOutlineOpen)}
              className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Đề xuất cải thiện & Tái cấu trúc Outline CV (6 phần cốt lõi)
                </h4>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <span>{isOutlineOpen ? 'Thu gọn' : 'Xem chi tiết'}</span>
                {isOutlineOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isOutlineOpen && (
              <div className="p-5 bg-white divide-y divide-slate-100 space-y-4">
                <p className="text-xs text-slate-500 pb-2 leading-relaxed">
                  Định hướng hoàn thiện cấu trúc hồ sơ dành riêng cho vị trí <strong>{result.job_title}</strong> tại <strong>{result.employer_name}</strong>. 
                  Tuyệt đối bảo đảm tính trung thực: không khai báo thông tin giả mạo và không tự nhận kỹ năng khi chưa học.
                </p>

                {result.cv_outline_recommendations && result.cv_outline_recommendations.map((sec: CVSectionRecommendation) => (
                  <div key={sec.section_id} className="pt-4 first:pt-0 space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      <span>{sec.section_name}</span>
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] leading-relaxed">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700 block mb-0.5">📌 Nên giữ:</span>
                        <p className="text-slate-600">{sec.keep_advice}</p>
                      </div>
                      <div className="p-2.5 bg-teal-50/70 rounded-lg border border-teal-100">
                        <span className="font-semibold text-teal-800 block mb-0.5">🎯 Ưu tiên cho JD này:</span>
                        <p className="text-teal-900">{sec.priority_advice}</p>
                      </div>
                      <div className="p-2.5 bg-blue-50/70 rounded-lg border border-blue-100">
                        <span className="font-semibold text-blue-800 block mb-0.5">💡 Minh chứng nên bổ sung:</span>
                        <p className="text-blue-900">{sec.evidence_advice}</p>
                      </div>
                      <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-100">
                        <span className="font-semibold text-amber-800 block mb-0.5">⚠️ Lưu ý học tập:</span>
                        <p className="text-amber-900">{sec.learning_caution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
