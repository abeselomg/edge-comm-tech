export type PartnerSeed = {
  name: string;
  label: string;
  category: "data-center" | "cloud" | "network" | "cyber" | "applications";
  ring: "0" | "1";
};

/**
 * Carried over from the pre-CMS content file. These are the vendors Edge
 * already listed, so they seed as published. Logos are added in the CMS.
 */
export const partnerSeeds: PartnerSeed[] = [
  { name: "Cisco", label: "Networking", category: "network", ring: "0" },
  { name: "Hikvision", label: "Surveillance", category: "data-center", ring: "0" },
  { name: "Vertiv", label: "Critical systems", category: "data-center", ring: "0" },
  { name: "Dell Technologies", label: "Compute", category: "cloud", ring: "0" },
  { name: "HPE", label: "Servers", category: "cloud", ring: "0" },
  { name: "Rittal", label: "Racks", category: "data-center", ring: "0" },
  { name: "Huawei", label: "Campus", category: "network", ring: "0" },
  { name: "Microsoft", label: "Cloud", category: "cloud", ring: "0" },
  { name: "Canovate", label: "Cabling", category: "data-center", ring: "0" },
  { name: "ZKTeco", label: "Access control", category: "data-center", ring: "0" },
  { name: "Eaton", label: "Power", category: "data-center", ring: "0" },
  { name: "Schneider", label: "UPS", category: "data-center", ring: "0" },
  { name: "HPE Aruba", label: "Wireless & LAN", category: "network", ring: "1" },
  { name: "Juniper", label: "Routing", category: "network", ring: "1" },
  { name: "Fortinet", label: "Secure networking", category: "cyber", ring: "1" },
  { name: "Palo Alto", label: "Firewall", category: "cyber", ring: "1" },
  { name: "CrowdStrike", label: "Endpoint", category: "cyber", ring: "1" },
  { name: "Veeam", label: "Data protection", category: "cloud", ring: "1" },
  { name: "Nutanix", label: "HCI", category: "cloud", ring: "1" },
  { name: "VMware", label: "Virtualization", category: "cloud", ring: "1" },
  { name: "Oracle", label: "Database", category: "applications", ring: "1" },
  { name: "SAP", label: "ERP", category: "applications", ring: "1" },
  { name: "Salesforce", label: "CRM", category: "applications", ring: "1" },
  { name: "ServiceNow", label: "Workflow", category: "applications", ring: "1" },
  { name: "OpenText", label: "Content", category: "applications", ring: "1" },
  { name: "Lenovo", label: "Compute", category: "cloud", ring: "1" },
];
