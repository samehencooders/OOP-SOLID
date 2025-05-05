export interface AnalyticsData {
  cycleTime: CycleTimeMetrics
  leadTime: LeadTimeMetrics
  flowEfficiency: FlowEfficiencyMetrics
  teamCapacity: CapacityMetrics
  riskPredictions: RiskPrediction[]
  bottleneckData: BottleneckData
  cumulativeFlow: CumulativeFlowData[]
}

export interface CycleTimeMetrics {
  average: number // In days
  median: number
  percentile90: number
  byPriority: Record<string, number>
  byStage: Record<string, number>
  trend: TimeSeriesData[]
}

export interface LeadTimeMetrics {
  average: number // In days
  median: number
  percentile90: number
  byType: Record<string, number>
  trend: TimeSeriesData[]
}

export interface FlowEfficiencyMetrics {
  overall: number // Percentage
  byStage: Record<string, number>
  trend: TimeSeriesData[]
}

export interface CapacityMetrics {
  current: number // Tasks per week
  forecast: number[]
  utilizationRate: number // Percentage
  byTeamMember: Record<string, number>
}

export interface RiskPrediction {
  taskId: string
  probability: number // 0-1
  factors: RiskFactor[]
  suggestedActions: string[]
}

export interface RiskFactor {
  name: string
  impact: number // 0-1
  description: string
}

export interface BottleneckData {
  stageId: string
  severity: number // 0-1
  waitTime: number // In hours
  taskCount: number
}

export interface CumulativeFlowData {
  date: Date
  stageData: Record<string, number> // stageId -> task count
}

export interface TimeSeriesData {
  date: Date
  value: number
}
