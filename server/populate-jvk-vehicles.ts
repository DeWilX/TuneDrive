import { db } from './db';
import { vehicles } from '@shared/schema';
import { jvkVehicleData } from './jvk-vehicle-data';

async function populateJVKVehicles() {
  console.log('Starting JVK Pro vehicle database population...');
  
  try {
    // Clear existing vehicle data
    console.log('Clearing existing vehicle data...');
    await db.delete(vehicles);
    
    // Insert JVK vehicle data in batches to avoid memory issues
    const batchSize = 50;
    const totalVehicles = jvkVehicleData.length;
    
    for (let i = 0; i < totalVehicles; i += batchSize) {
      const batch = jvkVehicleData.slice(i, i + batchSize);
      await db.insert(vehicles).values(batch);
      console.log(`Inserted batch: ${Math.min(i + batchSize, totalVehicles)}/${totalVehicles} vehicles`);
    }
    
    console.log(`Successfully populated database with ${totalVehicles} JVK Pro vehicles!`);
    console.log('JVK Pro database includes:');
    console.log('- Comprehensive brand coverage from Acura to Volvo Trucks');
    console.log('- European, American, Asian, and agricultural vehicles');
    console.log('- Detailed generation and engine specifications');
    console.log('- Complete power and torque tuning data');
    
  } catch (error) {
    console.error('Error populating JVK Pro vehicles:', error);
  }
}

// Run the population if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateJVKVehicles();
}

export { populateJVKVehicles };