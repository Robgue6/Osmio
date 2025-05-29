import { type AuthUser } from 'wasp/auth';
import { Link } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';
import { cn } from '../../cn';

// Interface for operation items
interface OperationItem {
  id: string;
  label: string;
  path: string;
}

// Souscription operations
const souscriptionItems: OperationItem[] = [
  {
    id: 'assurance-vie',
    label: 'Assurance Vie',
    path: '/dashboard/delegate/souscription/assurance-vie'
  },
  {
    id: 'per',
    label: 'PER',
    path: '/dashboard/delegate/souscription/per'
  },
  {
    id: 'scpi-pp',
    label: 'SCPI Pleine Propriété',
    path: '/dashboard/delegate/souscription/scpi-pp'
  },
  {
    id: 'scpi-np',
    label: 'SCPI Nue Propriété',
    path: '/dashboard/delegate/souscription/scpi-np'
  }
];

// Actes de Gestion operations
const actesGestionItems: OperationItem[] = [
  {
    id: 'changement-rib',
    label: 'Arbitrage',
    path: '/dashboard/delegate/acte/changement-rib'
  },
  
];

// Operation button component
const OperationButton = ({ item }: { item: OperationItem }) => (
  <Link
    to={item.path}
    className="w-full flex items-center justify-between px-4 py-3 mb-2 rounded-lg text-gray-700 dark:text-gray-200 font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
  >
    <span>{item.label}</span>
    <span className="text-sm px-3 py-1 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">Accéder</span>
  </Link>
);

// Main component
const DelegatePage = ({ user }: { user: AuthUser }) => {
  return (
    <SidebarLayout user={user}>
      <div className="w-full min-h-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Déléguer une opération</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Souscription Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[300px] border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Souscription</h2>
              <div className="space-y-3">
                {souscriptionItems.map(item => (
                  <OperationButton key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Actes de Gestion Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[300px] border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Actes de Gestion</h2>
              <div className="space-y-3">
                {actesGestionItems.map(item => (
                  <OperationButton key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DelegatePage; 