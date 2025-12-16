
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN', // Gestor da Frota
  MECHANIC = 'MECHANIC', // Operacional
  AUDITOR = 'AUDITOR' // Leitura
}

export enum TireStatus {
  STOCK = 'Em Estoque',
  INSTALLED = 'Instalado',
  AWAITING_RETREAD = 'Aguardando/Em Recapagem', // Pneu retirado aguardando retorno
  SCRAP = 'Sucata'
}

export enum TireCondition {
  NEW = 'Novo',
  USED = 'Usado',
  RETREADED = 'Recapado'
}

export enum TreadType {
  LISA = 'Lisa',
  MISTA = 'Mista',
  BORRACHUDO = 'Borrachudo'
}

export enum MaintenanceType {
  INSPECTION = 'Inspeção',
  PRESSURE = 'Calibragem',
  ROTATION = 'Rodízio',
  REPAIR = 'Reparo / Conserto',
  RETREAD = 'Recapagem',
  MOUNT = 'Montagem',
  DISMOUNT = 'Desmontagem',
  ALIGNMENT = 'Alinhamento/Balanceamento'
}

// Axle Definitions
export type AxleRole = 'STEER' | 'DRIVE' | 'AUX' | 'TRAILER';

export type AxleDef = { 
  isDual: boolean; 
  role: AxleRole 
};

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  tenantId?: string;
}

export interface Company {
  id: string;
  name: string; // Razão Social
  fantasyName: string;
  cnpj: string;
  responsibleName: string;
  responsibleEmail: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface Collaborator {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  role: Role;
  admissionDate: string;
  resignationDate?: string;
  active: boolean;
  notes?: string;
}

export interface Brand {
  id: string;
  name: string; // Razão Social para Recapadoras, Nome para Marcas
  // TIRE=Pneu Novo, RETREAD=Banda, VEHICLE=Veículo, RETREADER=Recapadora (Loja)
  type: 'TIRE' | 'RETREAD' | 'VEHICLE' | 'RETREADER'; 
  active: boolean;
  
  // Campos detalhados para RETREADER (Mesma estrutura de Supplier)
  fantasyName?: string;
  cnpj?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  
  // Endereço detalhado
  street?: string;
  number?: string;
  district?: string;
  state?: string;
  zipCode?: string;
}

export interface Supplier {
  id: string;
  name: string; // Razão Social
  fantasyName?: string;
  cnpj: string;
  contactName: string;
  phone: string;
  email: string;
  active: boolean;
  
  // Endereço detalhado
  street?: string;
  number?: string;
  district?: string;
  state?: string;
  zipCode?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  isActive: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Customer {
  id: string;
  name: string;
  document: string; // CNPJ or CPF
  contactName: string;
  phone: string;
  email: string;
  address?: string;
  active: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  frequency: 'MONTHLY' | 'YEARLY'; // Cobrança Mensal ou Anual
  assetLimit: number; // Quantidade de caminhões
  active: boolean; // Status de disponibilidade do plano
  description?: string;
}

export interface MaintenanceRecord {
  id: string;
  tireId: string; // Serial Number or ID
  vehicleId?: string; // Optional, if installed
  date: string;
  type: MaintenanceType;
  cost: number;
  odometer: number;
  description: string;
  performedBy: string; // User name or Mechanic name
  position?: string;
}

export interface Tire {
  id: string;
  serialNumber: string; // Número a fogo
  
  // Life 0 Data (Global Catalog)
  brand: string;
  model: string;
  size: string;
  
  // Current Life Data
  status: TireStatus;
  condition: TireCondition;
  lifeCount: number; // 0, 1, 2, 3...
  
  // Retread Data (If Life > 0 or Awaiting)
  treadBrand?: string; // Marca da Banda (Vipal, Bandag...)
  treadModel?: string;
  treadType?: TreadType; // Lisa, Mista, Borrachudo
  retreader?: string; // Nome da Recapadora
  retreadSendDate?: string; // Data envio
  retreadReturnDate?: string; // Data retorno
  retreadCost?: number;

  // Usage Data
  currentDepth: number; // mm
  originalDepth: number; // mm
  currentPressure: number; // PSI
  accumulatedMileage: number; // Total life mileage
  
  // Location
  location: string; // "Estoque", "Recapadora X", or Vehicle Plate
  vehicleId?: string;
  position?: string; // e.g., "1L", "1R", "2LO", "2LI"
  
  // Financial
  purchaseDate: string;
  purchaseCost: number; // Cost of the new tire (Life 0)
  
  // History tracking (Simplified for MVP)
  history?: string[]; 
}

export type VehicleCategory = 'TRUCK' | 'TRAILER' | 'BUS';

export interface Vehicle {
  id: string;
  plate: string;
  category: VehicleCategory; // Caminhão, Carreta, Ônibus
  type: string; // Toco, Truck, etc.
  model: string;
  brand: string;
  implement?: string; // e.g. Tanque, Baú, Sider
  odometer: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export interface TenantInternalNote {
  id: string;
  text: string;
  date: string;
  author: string;
}

export interface Tenant {
  id: string;
  name: string; // Razão Social
  fantasyName: string; // Nome Fantasia
  document: string; // CNPJ / CPF
  
  // Address
  address: {
    street: string;
    number: string;
    district: string;
    state: string;
    zipCode: string;
  };
  
  // Contact
  contactName: string; // Responsável
  phone: string;
  email: string;
  
  // Subscription
  plan: string; // Plan Name or ID
  status: 'Active' | 'Paused' | 'Cancelled' | 'Expired';
  expiresAt: string;
  assetLimit: number;
  currentAssets: number;

  // CRM
  origin?: string; // Google, Indicação, etc.
  internalNotes?: TenantInternalNote[];
}
