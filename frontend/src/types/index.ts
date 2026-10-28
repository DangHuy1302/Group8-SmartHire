export interface SystemStats {
  total_candidates: number;
  total_employers: number;
  total_jobs: number;
  total_skills: number;
  total_candidate_skills: number;
  total_job_skills: number;
  total_applications: number;
}

export interface JobSimple {
  id: number;
  title: string;
  salary_min: number;
  salary_max: number;
  min_experience_years: number;
  posted_date: string;
  employer_name: string;
}

export interface JobDetail {
  id: number;
  title: string;
  employer_id: number;
  employer_name: string;
  description: string;
  requirements: string;
  min_experience_years: number;
  salary_min: number;
  salary_max: number;
  currency: string;
  posted_date: string;
  status: string;
  required_skills: string[];
}

export interface CandidateSimple {
  id: number;
  full_name: string;
  email: string;
  current_title: string;
  years_of_experience: number;
  skills: string[];
}

export interface CandidateDetail {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  current_title: string;
  years_of_experience: number;
  cv_text: string;
  skills: string[];
}

export interface MatchRequest {
  cv_text: string;
  job_id: number;
  weight_tfidf?: number;
  weight_skills?: number;
}

export interface MatchResponse {
  job_id: number;
  job_title: string;
  employer_name: string;
  matching_score: number;
  tfidf_similarity: number;
  skill_match_ratio: number;
  matched_skills: string[];
  missing_skills: string[];
  extracted_cv_skills: string[];
  required_job_skills: string[];
  evaluation_comment: string;
}

export interface SkillStatItem {
  skill_name: string;
  category: string;
  candidate_count: number;
}

export interface SalaryTrendItem {
  period: string;
  avg_salary_min: number;
  avg_salary_max: number;
  avg_salary_mid: number;
  job_count: number;
}

export interface FunnelStageItem {
  stage_key: string;
  stage_name: string;
  count: number;
  conversion_rate_from_applied: number;
  step_conversion_rate: number;
}

export interface BIDashboardData {
  total_candidates: number;
  total_jobs: number;
  total_employers: number;
  total_applications: number;
  avg_market_salary_mid: number;
  skill_distribution: SkillStatItem[];
  salary_trends: SalaryTrendItem[];
  funnel_stages: FunnelStageItem[];
  salary_notes: string;
}

export interface LabeledPairResult {
  pair_id: number;
  candidate_name: string;
  job_title: string;
  ground_truth: number;
  calculated_score: number;
  predicted_label: number;
  is_correct: boolean;
}

export interface EvaluationSummary {
  threshold: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  true_positives: number;
  true_negatives: number;
  false_positives: number;
  false_negatives: number;
  pairs: LabeledPairResult[];
  methodology: string;
  limitations: string[];
}
