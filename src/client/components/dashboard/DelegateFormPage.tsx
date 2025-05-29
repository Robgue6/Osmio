import { type AuthUser } from 'wasp/auth';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarLayout from '../SidebarLayout';
import { createDelegationOperation } from 'wasp/client/operations';

// Map paths to form configurations
interface FormConfig {
  title: string;
  description: string;
  formUrl: string;
  operationType: string; // Added operationType to map to the database
  type: 'Souscription' | 'Actes de Gestion'; // Using union type
}

// IMPORTANT: Replace the placeholder URLs below with your actual Tally form embed URLs
// For each form, go to your Tally dashboard, select the form, click "Share",
// then "Embed" and copy the URL from the iframe src attribute.
// Make sure to add parameters like ?hideTitle=1&transparentBackground=1 if needed
const formConfigs: Record<string, FormConfig> = {
  // Souscription forms
  '/dashboard/delegate/souscription/assurance-vie': {
    title: 'Délégation Souscription Assurance Vie',
    description: 'Déléguez la mise en place d\'un contrat d\'assurance vie pour votre client',
    formUrl: 'https://tally.so/embed/mKa4yX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
    operationType: 'Assurance Vie',
    type: 'Souscription'
  },
  '/dashboard/delegate/souscription/per': {
    title: 'Délégation Souscription PER',
    description: 'Déléguez la mise en place d\'un Plan Épargne Retraite pour votre client',
    formUrl: 'https://tally.so/embed/mB2Wg5?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
    operationType: 'PER',
    type: 'Souscription'
  },
  '/dashboard/delegate/souscription/scpi-pp': {
    title: 'Délégation Souscription SCPI en Pleine Propriété',
    description: 'Déléguez la souscription de parts de SCPI en pleine propriété pour votre client',
    formUrl: 'https://tally.so/embed/nrkZ5R?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
    operationType: 'SCPI Pleine Propriété',
    type: 'Souscription'
  },
  '/dashboard/delegate/souscription/scpi-np': {
    title: 'Délégation Souscription SCPI en Nue Propriété',
    description: 'Déléguez la souscription de parts de SCPI en démembrement pour votre client',
    formUrl: 'https://tally.so/embed/wAjXpD?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
    operationType: 'SCPI Nue Propriété',
    type: 'Souscription'
  },
  
  // Actes de gestion forms
  '/dashboard/delegate/acte/changement-rib': {
    title: 'Arbitrage',
    description: 'Déléguez un arbitrage sur les contrats de votre client',
    formUrl: 'https://tally.so/embed/mOoN7R?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
    operationType: 'Arbitrage',
    type: 'Actes de Gestion'
  }
};

// Define types for Tally form submission
interface TallyField {
  id: string;
  title: string;
  type: string;
  answer: {
    value: any;
    raw: any;
  };
}

interface TallySubmissionPayload {
  id: string;
  respondentId: string;
  formId: string;
  formName: string;
  createdAt: Date;
  fields: TallyField[];
}

// Define a type for the form data
interface FormData {
  clientName?: string;
  name?: string;
  notes?: string;
  [key: string]: any; // Allow for other fields
}

const DelegateFormPage = ({ user }: { user: AuthUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const config = formConfigs[location.pathname];
    if (config) {
      setFormConfig(config);
    } else {
      // Redirect to delegate page if path not found
      navigate('/dashboard/delegate');
    }
  }, [location.pathname, navigate]);

  // Listen for form submission message from Tally
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Debug all received messages
      console.log('Received message from iframe:', event.origin, event.data);
      
      // This is the correct format according to Tally documentation
      if (event.data && typeof event.data === 'string' && event.data.includes('Tally.FormSubmitted')) {
        try {
          console.log('Tally form submission detected');
          
          // Parse the JSON data from the event
          const parsedData = JSON.parse(event.data);
          const submissionPayload = parsedData.payload;
          
          console.log('Submission payload:', submissionPayload);
          
          if (!submissionPayload || !formConfig) return;
          
          // Extract client name from the form fields
          let clientName = 'Client';
          let notes = '';
          
          if (submissionPayload.fields && Array.isArray(submissionPayload.fields)) {
            // Look for a name field in the submission
            const nameField = submissionPayload.fields.find(
              (field: TallyField) => field.title.toLowerCase().includes('nom') || 
                      field.title.toLowerCase().includes('name') || 
                      field.title.toLowerCase().includes('client')
            );
            
            if (nameField && nameField.answer && nameField.answer.value) {
              clientName = nameField.answer.value;
            }
            
            // Look for notes
            const notesField = submissionPayload.fields.find(
              (field: TallyField) => field.title.toLowerCase().includes('notes') || 
                      field.title.toLowerCase().includes('commentaire')
            );
            
            if (notesField && notesField.answer && notesField.answer.value) {
              notes = notesField.answer.value;
            }
          }
          
          // Create an operation from the submission
          createDelegationOperation({
            name: `${formConfig.operationType} - ${clientName}`,
            clientName,
            type: formConfig.type,
            operationType: formConfig.operationType,
            formData: submissionPayload,
            notes
          })
          .then((result: any) => {
            console.log('Operation created successfully from Tally submission:', result);
            setIsSubmitted(true);
            
            setTimeout(() => {
              navigate('/dashboard/operations');
            }, 3000);
          })
          .catch((error: any) => {
            console.error('Error creating operation from Tally submission:', error);
          });
        } catch (error: any) {
          console.error('Error processing Tally form submission:', error);
        }
      }
    };

    console.log('Setting up Tally form submission listener');
    window.addEventListener('message', handleMessage);
    
    return () => {
      console.log('Removing Tally form submission listener');
      window.removeEventListener('message', handleMessage);
    };
  }, [formConfig, navigate]);

  // Form submission handler - use this for direct form submission
  const handleDirectSubmit = async () => {
    console.log('Handling direct form submission');
    
    if (!formConfig) return;
    
    try {
      // Create a simple operation with basic data
      const result: any = await createDelegationOperation({
        name: `${formConfig.operationType} - Direct Submit`,
        clientName: 'Client Test',
        type: formConfig.type,
        operationType: formConfig.operationType,
        formData: { directSubmit: true } as FormData,
        notes: 'Created via direct submit button'
      });
      
      console.log('Operation created successfully:', result);
      
      // Show success message
      setIsSubmitted(true);
      
      // Redirect to operations page after a delay
      setTimeout(() => {
        navigate('/dashboard/operations');
      }, 3000);
    } catch (error: any) {
      console.error('Error creating operation:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/delegate');
  };

  if (!formConfig) {
    return (
      <SidebarLayout user={user}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout user={user}>
      <div className="w-full min-h-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8">
          {isSubmitted ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 text-center">
              <div className="mb-4 text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Formulaire envoyé avec succès!</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Votre demande a été enregistrée et sera traitée dans les plus brefs délais.</p>
              <button
                onClick={() => navigate('/dashboard/operations')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir mes opérations
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{formConfig.title}</h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{formConfig.description}</p>
                </div>
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Retour
                </button>
              </div>
              
              <div className="h-[calc(100vh-280px)] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <iframe
                  ref={iframeRef}
                  src={formConfig.formUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title={formConfig.title}
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DelegateFormPage; 