export interface CompanyKey {
  uuid: string; // PK
  companyWallet: string; // SK - from the user that created the company
}

export interface CreateCompany extends CompanyKey {
  name: string;
  title: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  location?: string;
  // tags: string[];
}
