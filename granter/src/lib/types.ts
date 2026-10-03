export type ProjectStatus = 'podana' | 'schvalena' | 'realizacia' | 'vyuctovana' | 'zamietnuta';

export type ItemState = 'caka' | 'objednane' | 'dorucene';

export type DeadlineKind = 'podanie' | 'hodnotenie' | 'realizacia' | 'zaverecna' | 'vyuctovanie';

export type OrgType = 'obec' | 'oz' | 'skola' | 'firma';

/** Dátum vo formáte YYYY-MM-DD */
export type ISODate = string;

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  state: ItemState;
}

export interface Project {
  id: string;
  name: string;
  provider: string;
  callName: string;
  amount: number;
  status: ProjectStatus;
  deadlines: Partial<Record<DeadlineKind, ISODate>>;
  items: BudgetItem[];
  notes: string;
  createdAt: string;
}

export interface Settings {
  orgName: string;
  orgType: OrgType;
  email: string;
  notificationsEnabled: boolean;
  notifyDays: number[];
}

export interface GrantCall {
  id: string;
  name: string;
  provider: string;
  deadline: ISODate;
  amountText: string;
  area: CallArea;
  orgTypes: OrgType[];
  description: string;
}

export type CallArea = 'kultura' | 'sport' | 'zp' | 'socialna' | 'infra' | 'vzdelavanie';

export interface Deadline {
  projectId: string;
  projectName: string;
  kind: DeadlineKind;
  date: ISODate;
  days: number;
}
