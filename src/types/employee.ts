export interface Employee {
  id: string;
  name: string;
  role: string;
  access: 'read' | 'write' | 'read-write';
  department: string;
  joinDate: string;
}
