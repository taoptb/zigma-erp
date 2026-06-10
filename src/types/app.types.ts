import type { Database } from './database.types'

type Tables = Database['public']['Tables']
type Enums = Database['public']['Enums']

// ── Row types ─────────────────────────────────────────────────────────────────
export type Shop = Tables['shops']['Row']
export type Profile = Tables['profiles']['Row']
export type ShopInvitation = Tables['shop_invitations']['Row']
export type Customer = Tables['customers']['Row']
export type Vehicle = Tables['vehicles']['Row']
export type Job = Tables['jobs']['Row']
export type JobStatusHistory = Tables['job_status_history']['Row']
export type JobDamageChecklist = Tables['job_damage_checklist']['Row']
export type StockItem = Tables['stock_items']['Row']
export type StockMovement = Tables['stock_movements']['Row']
export type FilmRoll = Tables['film_rolls']['Row']
export type FilmTemplate = Tables['film_templates']['Row']
export type FilmCut = Tables['film_cuts']['Row']
export type InsuranceClaim = Tables['insurance_claims']['Row']
export type ClaimDocument = Tables['claim_documents']['Row']
export type Invoice = Tables['invoices']['Row']
export type InvoiceItem = Tables['invoice_items']['Row']
export type TechnicianCapacity = Tables['technician_capacity']['Row']
export type JobAssignment = Tables['job_assignments']['Row']
export type NotificationLog = Tables['notification_logs']['Row']
export type NotificationRule = Tables['notification_rules']['Row']

// ── Enum types ────────────────────────────────────────────────────────────────
export type UserRole = Enums['user_role']
export type JobStatus = Enums['job_status']
export type JobType = Enums['job_type']
export type GlassPosition = Enums['glass_position']
export type StockStatus = Enums['stock_status']
export type StockCategory = Enums['stock_category']
export type ClaimStatus = Enums['claim_status']
export type InvoiceStatus = Enums['invoice_status']
export type NotificationChannel = Enums['notification_channel']
export type NotificationEvent = Enums['notification_event']

// ── Enriched / joined types (returned by query functions) ────────────────────
export type JobWithRelations = Job & {
  vehicle: Vehicle | null
  customer: Customer | null
  technician: Profile | null
}

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[]
  customer: Customer | null
}

export type ClaimWithDocuments = InsuranceClaim & {
  documents: ClaimDocument[]
  job: Job | null
}

// ── Film calculator ───────────────────────────────────────────────────────────
export type CarType = 'sedan_s' | 'sedan_m' | 'suv' | 'pickup' | 'van'
export type FilmPosition = 'front' | 'rear' | 'side_front' | 'side_rear'

export interface FilmCalculationInput {
  carType: CarType
  positions: FilmPosition[]
  filmRollId: string
}

export interface FilmCalculationBreakdown {
  position: FilmPosition
  baseLength: number
  margin: number
  totalLength: number
}

export interface FilmCalculationResult {
  breakdown: FilmCalculationBreakdown[]
  totalLengthM: number
  remainingAfterM: number
  isEnough: boolean
}

// ── Auth / shop context ───────────────────────────────────────────────────────
export interface ShopContext {
  shopId: string
  shop: Shop
  profile: Profile
  role: UserRole
}
