import { HttpError } from "wasp/server";

// Reuse the same DelegationOperation type or import it
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

export const getUserDelegationOperations = async (_args: void, context: any): Promise<DelegationOperation[]> => {
  console.log('Fetching delegation operations for user');
  
  if (!context.user) {
    console.error('No user in context');
    throw new HttpError(401, "You must be logged in to view operations");
  }
  
  console.log('User ID:', context.user.id);

  try {
    // Fetch all operations for the current user
    const operations = await context.entities.DelegationOperation.findMany({
      where: { userId: context.user.id },
      orderBy: { createdAt: "desc" }
    });
    
    console.log(`Found ${operations.length} operations:`, operations);
    return operations;
  } catch (error) {
    console.error('Error fetching operations:', error);
    throw error;
  }
}; 