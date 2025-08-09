// This file contains mock data structure for reference
// The actual data is stored in the backend storage

export interface VehicleData {
  brand: string;
  model: string;
  variant: string;
  vehicleType: 'car' | 'truck' | 'tractor';
  originalPower: number; // HP
  originalTorque: number; // Nm
  stage1Power: number; // HP
  stage1Torque: number; // Nm
  stage2Power?: number; // HP
  stage2Torque?: number; // Nm
}

export const vehicleTypes = [
  { value: 'car', label: 'Passenger Cars', icon: 'fa-car' },
  { value: 'truck', label: 'Commercial Vehicles', icon: 'fa-truck' },
  { value: 'tractor', label: 'Agricultural', icon: 'fa-tractor' }
] as const;
