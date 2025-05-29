import { type AuthUser } from 'wasp/auth';
import { useState, useEffect } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getUserDelegationOperations, createDelegationOperation, createSeedOperation } from 'wasp/client/operations';
import SidebarLayout from '../SidebarLayout';

interface Operation {
  id: string;
  name: string;
  type: 'Souscription' | 'Actes de Gestion';
  status: 'En attente' | 'En cours' | 'Terminé';
  createdAt: string;
  clientName: string;
  operationType: string;
  notes?: string;
}

// Add this for testing:
const createTestOperation = async () => {
  try {
    console.log('Creating test operation');
    const result = await createDelegationOperation({
      name: 'Test Operation',
      clientName: 'Test Client',
      type: 'Souscription',
      operationType: 'Test Type',
      formData: { test: true },
      notes: 'Test operation'
    });
    console.log('Test operation created:', result);
    return result;
  } catch (error) {
    console.error('Error creating test operation:', error);
  }
};

// Add this for creating a seed operation
const createSeedOperationIfNeeded = async () => {
  try {
    console.log('Creating seed operation if needed');
    const result = await createSeedOperation();
    console.log('Seed operation result:', result);
    return result;
  } catch (error) {
    console.error('Error creating seed operation:', error);
  }
};

// Add this component for showing notes in a tooltip
const NotesTooltip = ({ notes }: { notes?: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!notes) return null;
  
  return (
    <div className="relative">
      <button 
        className="ml-2 p-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {showTooltip && (
        <div className="absolute z-10 w-64 px-4 py-3 text-sm bg-white dark:bg-gray-700 rounded-lg shadow-lg left-full ml-2 top-0">
          <p className="text-gray-700 dark:text-gray-300">{notes}</p>
        </div>
      )}
    </div>
  );
};

const OperationsPage = ({ user }: { user: AuthUser }) => {
  // Use the query to fetch operations data
  const { data: operations, isLoading, error, refetch } = useQuery(getUserDelegationOperations);
  const [formattedOperations, setFormattedOperations] = useState<Operation[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  // Function to view operation details
  const viewOperationDetails = (operation: Operation) => {
    setSelectedOperation(operation);
    setShowDetail(true);
  };
  
  // Function to close detail view
  const closeDetailView = () => {
    setShowDetail(false);
    setSelectedOperation(null);
  };
  
  // Refresh function
  const refreshData = async () => {
    console.log('Manually refreshing operations data');
    try {
      await refetch();
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };
  
  // Refresh on mount
  useEffect(() => {
    refreshData();
  }, []);
  
  // Debug raw operations data
  useEffect(() => {
    console.log('Raw operations data:', operations);
  }, [operations]);
  
  // Format dates and prepare the data when operations are loaded
  useEffect(() => {
    if (operations && Array.isArray(operations)) {
      console.log('Formatting operations:', operations);
      
      const formatted = operations.map((op) => ({
        id: op.id,
        name: op.name,
        // Cast the string type to the union type - we assume the values are valid
        type: op.type as 'Souscription' | 'Actes de Gestion',
        status: op.status as 'En attente' | 'En cours' | 'Terminé',
        createdAt: new Date(op.createdAt).toLocaleDateString('fr-FR'),
        clientName: op.clientName,
        operationType: op.operationType,
        notes: op.notes
      }));
      
      console.log('Formatted operations:', formatted);
      setFormattedOperations(formatted);
    } else {
      console.log('Operations data is not in expected format:', operations);
    }
  }, [operations]);

  const getStatusColor = (status: Operation['status']) => {
    switch (status) {
      case 'En attente':
        return 'text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700';
      case 'En cours':
        return 'text-blue-700 bg-blue-50 border border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700';
      case 'Terminé':
        return 'text-green-700 bg-green-50 border border-green-200 dark:text-green-300 dark:bg-green-900/30 dark:border-green-700';
      default:
        return 'text-gray-700 bg-gray-50 border border-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  return (
    <SidebarLayout user={user}>
      <div className="w-full min-h-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Mes Opérations</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300">
                Suivez l'état d'avancement de vos opérations déléguées
              </p>
              <button
                onClick={refreshData}
                className="flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Rafraîchir
              </button>
            </div>

            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <div className="py-4 px-4 bg-red-50 text-red-700 rounded-lg">
                Une erreur est survenue lors du chargement de vos opérations.
              </div>
            )}

            {!isLoading && !error && formattedOperations.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p>Vous n'avez pas encore d'opérations déléguées.</p>
                <p className="mt-2">Utilisez l'onglet "Déléguer" pour créer votre première opération.</p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <button 
                    onClick={async () => {
                      await createTestOperation();
                      // Force refresh the data
                      refreshData();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Créer une opération de test
                  </button>
                  <button 
                    onClick={async () => {
                      await createSeedOperationIfNeeded();
                      // Force refresh the data
                      refreshData();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Créer une opération initiale
                  </button>
                </div>
              </div>
            )}

            {!isLoading && !error && formattedOperations.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                      <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200 rounded-tl-lg">
                        Opération
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">
                        Client
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">
                        Type
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200">
                        Statut
                      </th>
                      <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-200 rounded-tr-lg">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedOperations.map((operation, index) => (
                      <tr key={operation.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <h5 className="font-medium text-gray-800 dark:text-white">
                              {operation.operationType}
                            </h5>
                            {operation.notes && <NotesTooltip notes={operation.notes} />}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-700 dark:text-gray-300">
                            {operation.clientName}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-700 dark:text-gray-300">
                            {operation.type}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(operation.status)}`}>
                            {operation.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-between">
                            <p className="text-gray-700 dark:text-gray-300">
                              {operation.createdAt}
                            </p>
                            <button
                              onClick={() => viewOperationDetails(operation)}
                              className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Voir les détails"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operation Detail Modal */}
      {showDetail && selectedOperation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Détails de l'opération
                </h2>
                <button
                  onClick={closeDetailView}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type d'opération</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedOperation.operationType}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedOperation.clientName}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Catégorie</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedOperation.type}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
                  <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getStatusColor(selectedOperation.status)}`}>
                    {selectedOperation.status}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date de création</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedOperation.createdAt}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                  <p className="text-gray-800 dark:text-white font-medium whitespace-pre-wrap">
                    {selectedOperation.notes || "Aucune note"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={closeDetailView}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
};

export default OperationsPage; 