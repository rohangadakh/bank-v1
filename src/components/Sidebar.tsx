import { LogOut, LayoutDashboard, ListPlus, Landmark, ClipboardPlus, Link } from 'lucide-react';

interface SidebarProps {
  currentView: 'site' | 'bank' | 'deposit' | 'reports' | 'dashboard';
  onViewChange: (view: 'site' | 'bank' | 'deposit' | 'reports' | 'dashboard') => void;
  onLogout: () => void;  // Add onLogout function prop
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' as const },
  { icon: Link, label: 'Site', view: 'site' as const },
  { icon: Landmark, label: 'Bank', view: 'bank' as const },
  { icon: ListPlus, label: 'Deposit', view: 'deposit' as const },
  { icon: ClipboardPlus, label: 'Report', view: 'reports' as const },
];

export function Sidebar({ currentView, onViewChange, onLogout }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 text-gray-900 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Report System</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => onViewChange(item.view)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  currentView === item.view
                    ? 'bg-blue-50 text-gray-800'
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={onLogout}  // Trigger the logout function passed from parent
        className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors mt-auto"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
