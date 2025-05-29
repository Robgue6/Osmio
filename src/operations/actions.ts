import { HttpError } from "wasp/server";

type DelegationOperationInput = {
  name: string;
  clientName: string;
  type: string;
  operationType: string;
  formData?: Record<string, any>;
  notes?: string;
};

type DelegationOperation = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  name: string;
  clientName: string;
  type: string;
  operationType: string;
  status: string;
  formData?: Record<string, any>;
  notes?: string;
};

export const createDelegationOperation = async (args: DelegationOperationInput, context: any) => {
  console.log('Creating delegation operation with args:', args);
  
  if (!context.user) {
    console.error('No user in context');
    throw new HttpError(401, "You must be logged in to create an operation");
  }
  console.log('User ID:', context.user.id);

  const { name, clientName, type, operationType, formData, notes } = args;
  console.log('Parsed operation data:', { name, clientName, type, operationType });

  // Validate the type is one of the allowed values
  const validType = type === 'Souscription' || type === 'Actes de Gestion' 
    ? type 
    : 'Actes de Gestion'; // Default value if invalid
  
  console.log('Using type:', validType);

  try {
    // Create the operation in the database
    const newOperation = await context.entities.DelegationOperation.create({
      data: {
        name,
        clientName,
        type: validType,
        operationType,
        formData: formData || {},
        notes,
        status: "En attente", // Default status
        user: { connect: { id: context.user.id } }
      }
    });
    
    console.log('Operation created successfully:', newOperation);
    return newOperation;
  } catch (error) {
    console.error('Error creating operation:', error);
    throw error;
  }
};

type UpdateStatusInput = {
  operationId: string;
  status: "En attente" | "En cours" | "Terminé";
};

export const updateDelegationOperationStatus = async (args: UpdateStatusInput, context: any) => {
  if (!context.user) {
    throw new HttpError(401, "You must be logged in to update an operation");
  }

  const { operationId, status } = args;

  // Check if operation exists and belongs to the user
  const operation = await context.entities.DelegationOperation.findUnique({
    where: { id: operationId }
  });

  if (!operation) {
    throw new HttpError(404, "Operation not found");
  }

  if (operation.userId !== context.user.id && !context.user.isAdmin) {
    throw new HttpError(403, "You don't have permission to update this operation");
  }

  // Update the operation status
  const updatedOperation = await context.entities.DelegationOperation.update({
    where: { id: operationId },
    data: { status }
  });

  return updatedOperation;
};

// Add this function to create a seed operation for testing
export const createSeedOperation = async (context: any) => {
  console.log('Creating seed operation');
  
  if (!context.user) {
    console.error('No user in context');
    throw new HttpError(401, "You must be logged in to create an operation");
  }
  
  try {
    // Check if there are any existing operations
    const existingOperations = await context.entities.DelegationOperation.findMany({
      where: { userId: context.user.id },
      take: 1
    });
    
    if (existingOperations.length > 0) {
      console.log('Seed operation not needed, operations already exist');
      return null;
    }
    
    // Create the operation in the database
    const seedOperation = await context.entities.DelegationOperation.create({
      data: {
        name: "Souscription Assurance Vie - Client Seed",
        clientName: "Client Seed",
        type: "Souscription",
        operationType: "Assurance Vie",
        formData: { seed: true },
        notes: "Opération de test créée automatiquement",
        status: "En attente",
        user: { connect: { id: context.user.id } }
      }
    });
    
    console.log('Seed operation created successfully:', seedOperation);
    return seedOperation;
  } catch (error) {
    console.error('Error creating seed operation:', error);
    return null;
  }
}; 