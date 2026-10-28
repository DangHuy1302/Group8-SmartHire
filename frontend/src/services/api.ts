import axios from 'axios';
import {
  SystemStats,
  JobSimple,
  JobDetail,
  CandidateSimple,
  CandidateDetail,
  MatchRequest,
  MatchResponse,
  BIDashboardData,
  EvaluationSummary
} from '../types';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getSystemOverview: async (): Promise<SystemStats> => {
    const res = await apiClient.get<SystemStats>('/system/overview');
    return res.data;
  },

  getJobs: async (): Promise<JobSimple[]> => {
    const res = await apiClient.get<JobSimple[]>('/jobs');
    return res.data;
  },

  getJobDetail: async (jobId: number): Promise<JobDetail> => {
    const res = await apiClient.get<JobDetail>(`/jobs/${jobId}`);
    return res.data;
  },

  getCandidates: async (): Promise<CandidateSimple[]> => {
    const res = await apiClient.get<CandidateSimple[]>('/candidates');
    return res.data;
  },

  getCandidateDetail: async (candidateId: number): Promise<CandidateDetail> => {
    const res = await apiClient.get<CandidateDetail>(`/candidates/${candidateId}`);
    return res.data;
  },

  analyzeMatch: async (req: MatchRequest): Promise<MatchResponse> => {
    const res = await apiClient.post<MatchResponse>('/matching/analyze', req);
    return res.data;
  },

  getBIDashboard: async (): Promise<BIDashboardData> => {
    const res = await apiClient.get<BIDashboardData>('/bi/dashboard');
    return res.data;
  },

  getEvaluation: async (threshold: number = 45.0): Promise<EvaluationSummary> => {
    const res = await apiClient.get<EvaluationSummary>(`/testing/evaluation?threshold=${threshold}`);
    return res.data;
  },

  runAutomatedTests: async (): Promise<any> => {
    const res = await apiClient.get('/testing/run-suite');
    return res.data;
  }
};
