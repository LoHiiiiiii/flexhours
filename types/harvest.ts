export type HarvestToken = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export type HarvestUserAccounts = {
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  accounts: HarvestAccounts[]
}

export type HarvestAccounts = {
  id: number
  name: string
  product: string
  google_sign_in_required: boolean
}

export type HarvestUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  telephone: string
  timezone: string
  weekly_capacity: number
  has_access_to_all_future_projects: boolean
  is_contractor: boolean
  is_admin: boolean
  is_project_manager: boolean
  can_see_rates: boolean
  can_create_projects: boolean
  can_create_invoices: boolean
  is_active: boolean
  calendar_integration_enabled: boolean
  calendar_integration_source: number
  created_at: string
  updated_at: string
  roles: string[]
  permissions_claims: string[]
  avatar_url: string
}

export type HarvestTimeEntries = {
  id: number
  spent_date: string
  user: {
    id: number
    name: string
  }
  client: {
    id: number
    name: string
  }
  project: {
    id: number
    name: string
  }
  task: {
    id: number
    name: string
  }
  user_assignment: {
    id: number
    is_project_manager: boolean
    is_active: boolean
    budget: number
    created_at: Date
    updated_at: Date
    hourly_rate: number
  }
  task_assignment: {
    id: number
    billable: boolean
    is_active: boolean
    created_at: Date
    updated_at: Date
    hourly_rate: number
    budget: number
  }
  hours: number
  hours_without_timer: number
  rounded_hours: number
  notes: string
  created_at: Date
  updated_at: Date
  is_locked: boolean
  locked_reason: string
  is_closed: boolean
  is_billed: boolean
  timer_started_at: number
  started_time: string
  ended_time: string
  is_running: boolean
  invoice: number
  external_reference: number
  billable: boolean
  budgeted: boolean
  billable_rate: number
  cost_rate: number
}

export type HarvestTimeEntriesAndPagesResponse = {
  total_pages: number
  time_entries: HarvestTimeEntries[]
}

export type HarvestTimeEntriesResponse = {
  total_pages: number
  time_entries: HarvestTimeEntries[]
}
