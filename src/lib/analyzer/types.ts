// Types mirroring the structures produced by the original Python analyzer.
// Keeping field names consistent with the Python `findings` dict makes the
// AI report-generation prompt trivial to port 1:1.

export interface SslInfo {
  has_ssl: boolean;
  note?: string;
  expires?: string;
  days_until_expiry?: number;
  issuer?: Record<string, string>;
  error?: string;
}

export interface SecurityHeaders {
  present: Record<string, boolean>;
  missing: string[];
}

export interface SeoTitleCheck {
  present: boolean;
  text: string | null;
  length: number;
  ok_length: boolean;
}

export interface SeoMetaDescriptionCheck {
  present: boolean;
  text: string | null;
  length: number;
  ok_length: boolean;
}

export interface SeoH1Check {
  count: number;
  texts: string[];
  ok: boolean;
}

export interface SeoFindings {
  title: SeoTitleCheck;
  meta_description: SeoMetaDescriptionCheck;
  h1: SeoH1Check;
  canonical: { present: boolean };
  robots_meta: {
    present: boolean;
    content: string | null;
    blocks_indexing: boolean;
  };
  viewport_meta: { present: boolean };
  open_graph: { count: number; present: boolean };
}

export interface AccessibilityFindings {
  images: {
    total: number;
    missing_alt: number;
    examples_missing_alt: string[];
  };
  lang_attribute: { present: boolean };
  heading_order: { skips_levels: boolean; sequence: number[] };
  form_inputs: { total: number; unlabeled: number };
  links: { total: number; empty_text_links: number };
}

export interface PerformanceFindings {
  response_time_seconds: number;
  page_size_kb: number;
  compression: { enabled: boolean; type: string | null };
  caching: { present: boolean; value: string | null };
  resource_counts: {
    external_scripts: number;
    inline_scripts: number;
    stylesheets: number;
    images: number;
  };
  render_blocking_scripts_in_head: number;
  images_missing_dimensions: number;
  images_using_lazy_load: number;
}

export interface BrokenLinksFindings {
  total_internal_links_found: number;
  checked_count: number;
  broken_count: number;
  broken_links: { url: string; status: number | null }[];
}

export interface PageSpeedFieldData {
  LCP_seconds?: number;
  LCP_category?: string;
  INP_ms?: number;
  INP_category?: string;
  CLS?: number;
  CLS_category?: string;
}

export interface PageSpeedResult {
  available: boolean;
  error?: string;
  strategy?: string;
  field_data_real_users?: PageSpeedFieldData | null;
  overall_category?: string;
  note?: string;
  lighthouse_scores?: Record<string, number | null>;
  lighthouse_lab_metrics?: Record<string, string>;
}

export interface MobileFriendlinessFindings {
  has_viewport_meta: boolean;
  viewport_content: string;
  likely_responsive: boolean;
}

export interface StandardsReference {
  core_web_vitals: {
    LCP: { good: number; poor: number; unit: string; note: string };
    INP: { good: number; poor: number; unit: string; note: string };
    CLS: { good: number; poor: number; unit: string; note: string };
    measured_as: string;
  };
  seo: {
    title_length: { min: number; max: number; unit: string };
    meta_description_length: { min: number; max: number; unit: string };
    h1_count: { ideal: number };
  };
}

export interface Findings {
  url: string;
  status_code: number;
  analyzed_at: string;
  standards_reference: StandardsReference;
  ssl: SslInfo;
  security_headers: SecurityHeaders;
  seo: SeoFindings;
  accessibility: AccessibilityFindings;
  performance: PerformanceFindings;
  pagespeed_core_web_vitals: PageSpeedResult | null;
  mobile_friendliness: MobileFriendlinessFindings;
  links: BrokenLinksFindings;
}

export type AnalysisStatus =
  | "QUEUED"
  | "FETCHING"
  | "RUNNING_CHECKS"
  | "GENERATING_REPORT"
  | "COMPLETE"
  | "FAILED";

export interface AnalysisRecord {
  id: string;
  url: string;
  status: AnalysisStatus;
  statusStep: string | null;
  errorMessage: string | null;
  findings: Findings | null;
  reportMarkdown: string | null;
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
