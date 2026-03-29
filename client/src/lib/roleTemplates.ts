import type { GateName } from '../types';

export interface RoleTemplate {
  id: string;
  title: string;
  category: 'C-Suite' | 'VP' | 'Director' | 'Senior Manager';
  roleName: string;
  roleLevel: string;
  jobDescription: string;
  suggestedGates: GateName[];
  icon: string;
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'cfo',
    title: 'Chief Financial Officer',
    category: 'C-Suite',
    roleName: 'CFO',
    roleLevel: 'C-Suite',
    jobDescription:
      'Oversee all financial operations including reporting, budgeting, forecasting, and capital allocation. Partner with the CEO and board to shape corporate strategy and drive sustainable growth. Lead finance, accounting, FP&A, and investor relations teams while ensuring regulatory compliance and fiduciary responsibility.',
    suggestedGates: ['financial_fluency', 'overconfidence_bias', 'decision_velocity'],
    icon: '💰',
  },
  {
    id: 'cto',
    title: 'Chief Technology Officer',
    category: 'C-Suite',
    roleName: 'CTO',
    roleLevel: 'C-Suite',
    jobDescription:
      'Define and execute the technology vision, architecture, and roadmap. Lead engineering, infrastructure, and security organizations. Evaluate build-vs-buy decisions, manage technical debt, and ensure platform scalability. Represent technology strategy to the board and external stakeholders.',
    suggestedGates: ['technical_depth', 'people_judgment', 'covert_narcissism', 'decision_velocity'],
    icon: '⚙️',
  },
  {
    id: 'coo',
    title: 'Chief Operating Officer',
    category: 'C-Suite',
    roleName: 'COO',
    roleLevel: 'C-Suite',
    jobDescription:
      'Drive operational excellence across the organization by aligning people, processes, and systems to strategic objectives. Own P&L accountability for core business units and lead cross-functional initiatives. Scale operations to support rapid growth while maintaining quality and efficiency.',
    suggestedGates: ['financial_fluency', 'people_judgment', 'decision_velocity', 'burnout_trajectory'],
    icon: '🏗️',
  },
  {
    id: 'chro',
    title: 'Chief Human Resources Officer',
    category: 'C-Suite',
    roleName: 'CHRO',
    roleLevel: 'C-Suite',
    jobDescription:
      'Lead the people strategy encompassing talent acquisition, organizational design, compensation, DEI, and culture. Advise the CEO and board on leadership succession and workforce planning. Build HR systems and programs that attract, develop, and retain top talent at scale.',
    suggestedGates: ['people_judgment', 'covert_narcissism', 'burnout_trajectory'],
    icon: '🤝',
  },
  {
    id: 'cpo',
    title: 'Chief Product Officer',
    category: 'C-Suite',
    roleName: 'CPO',
    roleLevel: 'C-Suite',
    jobDescription:
      'Own end-to-end product strategy, roadmap, and execution from discovery through delivery. Drive product-market fit by synthesizing customer insights, market trends, and business goals. Lead product management, design, and research teams while fostering a culture of experimentation and data-driven decision-making.',
    suggestedGates: ['customer_orientation', 'decision_velocity', 'technical_depth', 'overconfidence_bias'],
    icon: '🎨',
  },
  {
    id: 'vp-engineering',
    title: 'VP of Engineering',
    category: 'VP',
    roleName: 'VP Engineering',
    roleLevel: 'VP',
    jobDescription:
      'Lead a multi-team engineering organization responsible for platform reliability, feature delivery, and engineering culture. Own hiring, retention, and career development for 50-200+ engineers. Balance technical excellence with business delivery timelines and manage cross-team dependencies.',
    suggestedGates: ['technical_depth', 'people_judgment', 'covert_narcissism', 'burnout_trajectory'],
    icon: '🛠️',
  },
  {
    id: 'vp-sales',
    title: 'VP of Sales',
    category: 'VP',
    roleName: 'VP Sales',
    roleLevel: 'VP',
    jobDescription:
      'Build and scale the sales organization to achieve aggressive revenue targets. Design territory plans, compensation structures, and pipeline management processes. Coach front-line managers, establish forecasting discipline, and partner with marketing and product to refine go-to-market strategy.',
    suggestedGates: ['customer_orientation', 'financial_fluency', 'people_judgment', 'overconfidence_bias'],
    icon: '📈',
  },
  {
    id: 'vp-product',
    title: 'VP of Product',
    category: 'VP',
    roleName: 'VP Product',
    roleLevel: 'VP',
    jobDescription:
      'Define product vision and strategy across multiple product lines. Lead a team of product managers and designers to deliver outcomes that drive user engagement and revenue growth. Prioritize the roadmap based on customer data, competitive analysis, and strategic bets.',
    suggestedGates: ['customer_orientation', 'decision_velocity', 'technical_depth', 'covert_narcissism'],
    icon: '🧭',
  },
  {
    id: 'director-engineering',
    title: 'Director of Engineering',
    category: 'Director',
    roleName: 'Director of Engineering',
    roleLevel: 'Director',
    jobDescription:
      'Manage multiple engineering teams delivering a critical product area or platform domain. Set technical direction, drive architectural decisions, and ensure high-quality output. Hire and mentor engineering managers, establish team processes, and remove organizational blockers to execution.',
    suggestedGates: ['technical_depth', 'people_judgment', 'burnout_trajectory'],
    icon: '🔧',
  },
  {
    id: 'head-of-people',
    title: 'Head of People',
    category: 'Senior Manager',
    roleName: 'Head of People',
    roleLevel: 'Senior Manager',
    jobDescription:
      'Design and run core people programs including performance management, learning and development, employee engagement, and organizational health. Partner with business leaders to address team dynamics, retention risks, and workforce planning. Serve as a trusted advisor to senior leadership on all people matters.',
    suggestedGates: ['people_judgment', 'covert_narcissism', 'burnout_trajectory'],
    icon: '🌱',
  },
];
