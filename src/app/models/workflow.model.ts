export interface Workflow {
    id: string
    name: string
    description: string
    stages: WorkflowStage[]
    createdAt: Date
    updatedAt: Date
    createdBy: string 
    isTemplate: boolean
    templateCategory?: string
    aiGenerated: boolean
  }
  
  export interface WorkflowStage {
    id: string
    name: string
    description: string
    order: number
    wipLimit: number | null 
    color: string
    isEntryPoint: boolean
    isExitPoint: boolean
    transitionRules: TransitionRule[]
  }
  
  export interface TransitionRule {
    id: string
    targetStageId: string
    condition: string 
    isAutomatic: boolean
  }
  