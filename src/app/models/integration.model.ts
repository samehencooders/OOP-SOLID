export interface Integration {
  id: string
  name: string
  provider: IntegrationProvider
  status: "active" | "inactive" | "error"
  config: any // Provider-specific configuration
  lastSynced: Date | null
  createdAt: Date
  createdBy: string // User ID
}

export enum IntegrationProvider {
  SLACK = "slack",
  TEAMS = "teams",
  GOOGLE_WORKSPACE = "google_workspace",
  GITHUB = "github",
  GITLAB = "gitlab",
  JIRA = "jira",
  AZURE_DEVOPS = "azure_devops",
  CALENDAR = "calendar",
  STORAGE = "storage",
}

export interface WebhookDefinition {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  createdAt: Date
  createdBy: string // User ID
  lastTriggered: Date | null
  status: "active" | "inactive"
}

export interface ApiKey {
  id: string
  name: string
  key: string // Hashed value
  permissions: string[]
  createdAt: Date
  expiresAt: Date | null
  lastUsed: Date | null
}
