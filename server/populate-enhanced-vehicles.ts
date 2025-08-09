import { db } from "./db";
import { vehicles } from "@shared/schema";
import { enhancedVehicleData } from "./enhanced-vehicle-data";

export async function populateEnhancedVehicles() {
  try {
    console.log("Starting enhanced vehicle database population...");

    // Clear existing vehicle data
    console.log("Clearing existing vehicle data...");
    await db.delete(vehicles);

    // Insert enhanced vehicle data in batches for better performance
    const batchSize = 50;
    let totalInserted = 0;

    for (let i = 0; i < enhancedVehicleData.length; i += batchSize) {
      const batch = enhancedVehicleData.slice(i, i + batchSize);
      await db.insert(vehicles).values(batch);
      totalInserted += batch.length;
      console.log(`Inserted batch: ${totalInserted}/${enhancedVehicleData.length} vehicles`);
    }

    console.log(`Successfully populated database with ${totalInserted} enhanced vehicles!`);
    console.log("Enhanced database includes:");
    console.log("- Complete generation coverage with years for all models");
    console.log("- Comprehensive engine type coverage");
    console.log("- Detailed power and torque specifications");
    console.log("- Enhanced coverage for cars, trucks, and tractors");
    
    return true;
  } catch (error) {
    console.error("Error populating enhanced vehicles:", error);
    throw error;
  }
}

// Run population if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateEnhancedVehicles()
    .then(() => {
      console.log("Enhanced vehicle population completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Enhanced vehicle population failed:", error);
      process.exit(1);
    });
}