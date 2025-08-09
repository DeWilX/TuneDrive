import { db } from "./db";
import { vehicles, type InsertVehicle } from "@shared/schema";
import { sql } from "drizzle-orm";

import { massiveVehicleData } from "./massive-vehicle-data";

// Comprehensive vehicle database for European and American markets (excluding Asian brands)
const comprehensiveVehicleData: InsertVehicle[] = [
  ...massiveVehicleData,
  // === EUROPEAN BRANDS ===
  
  // AUDI - German Premium Brand
  // A1 Series
  { brand: "Audi", model: "A1", generation: "8X (2010-2018)", engine: "1.6 TDI", variant: "90hp", vehicleType: "car", originalPower: 90, originalTorque: 230, stage1Power: 115, stage1Torque: 280, stage2Power: 135, stage2Torque: 310 },
  { brand: "Audi", model: "A1", generation: "8X (2010-2018)", engine: "1.6 TDI", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 250, stage1Power: 145, stage1Torque: 300, stage2Power: 165, stage2Torque: 330 },
  { brand: "Audi", model: "A1", generation: "GB (2018-2024)", engine: "1.0 TFSI", variant: "95hp", vehicleType: "car", originalPower: 95, originalTorque: 175, stage1Power: 115, stage1Torque: 210, stage2Power: 130, stage2Torque: 235 },
  { brand: "Audi", model: "A1", generation: "GB (2018-2024)", engine: "1.0 TFSI", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 200, stage1Power: 140, stage1Torque: 240, stage2Power: 160, stage2Torque: 270 },
  
  // A3 Series
  { brand: "Audi", model: "A3", generation: "8P (2003-2013)", engine: "1.9 TDI", variant: "105hp", vehicleType: "car", originalPower: 105, originalTorque: 250, stage1Power: 135, stage1Torque: 300, stage2Power: 155, stage2Torque: 330 },
  { brand: "Audi", model: "A3", generation: "8P (2003-2013)", engine: "2.0 TDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Audi", model: "A3", generation: "8P (2003-2013)", engine: "2.0 TDI", variant: "170hp", vehicleType: "car", originalPower: 170, originalTorque: 350, stage1Power: 210, stage1Torque: 420, stage2Power: 240, stage2Torque: 460 },
  { brand: "Audi", model: "A3", generation: "8V (2012-2020)", engine: "1.4 TFSI", variant: "122hp", vehicleType: "car", originalPower: 122, originalTorque: 200, stage1Power: 150, stage1Torque: 240, stage2Power: 170, stage2Torque: 270 },
  { brand: "Audi", model: "A3", generation: "8V (2012-2020)", engine: "1.4 TFSI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 250, stage1Power: 185, stage1Torque: 290, stage2Power: 210, stage2Torque: 320 },
  { brand: "Audi", model: "A3", generation: "8V (2012-2020)", engine: "1.6 TDI", variant: "110hp", vehicleType: "car", originalPower: 110, originalTorque: 250, stage1Power: 140, stage1Torque: 300, stage2Power: 160, stage2Torque: 330 },
  { brand: "Audi", model: "A3", generation: "8V (2012-2020)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  { brand: "Audi", model: "A3", generation: "8V (2012-2020)", engine: "2.0 TFSI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 320, stage1Power: 230, stage1Torque: 380, stage2Power: 270, stage2Torque: 420 },
  { brand: "Audi", model: "A3", generation: "8V (2012-2020)", engine: "2.5 TFSI", variant: "400hp", vehicleType: "car", originalPower: 400, originalTorque: 480, stage1Power: 450, stage1Torque: 540, stage2Power: 500, stage2Torque: 590 },
  { brand: "Audi", model: "A3", generation: "8Y (2020-2024)", engine: "1.0 TFSI", variant: "110hp", vehicleType: "car", originalPower: 110, originalTorque: 200, stage1Power: 135, stage1Torque: 240, stage2Power: 155, stage2Torque: 270 },
  { brand: "Audi", model: "A3", generation: "8Y (2020-2024)", engine: "1.5 TFSI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 250, stage1Power: 185, stage1Torque: 300, stage2Power: 210, stage2Torque: 330 },
  { brand: "Audi", model: "A3", generation: "8Y (2020-2024)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 360, stage1Power: 190, stage1Torque: 420, stage2Power: 220, stage2Torque: 460 },
  
  // A4 Series
  { brand: "Audi", model: "A4", generation: "B6 (2000-2005)", engine: "1.9 TDI", variant: "130hp", vehicleType: "car", originalPower: 130, originalTorque: 310, stage1Power: 160, stage1Torque: 370, stage2Power: 185, stage2Torque: 410 },
  { brand: "Audi", model: "A4", generation: "B6 (2000-2005)", engine: "2.5 TDI", variant: "163hp", vehicleType: "car", originalPower: 163, originalTorque: 370, stage1Power: 200, stage1Torque: 440, stage2Power: 230, stage2Torque: 480 },
  { brand: "Audi", model: "A4", generation: "B7 (2004-2008)", engine: "2.0 TDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Audi", model: "A4", generation: "B7 (2004-2008)", engine: "3.0 TDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "Audi", model: "A4", generation: "B8 (2008-2015)", engine: "1.8 TFSI", variant: "160hp", vehicleType: "car", originalPower: 160, originalTorque: 250, stage1Power: 195, stage1Torque: 300, stage2Power: 220, stage2Torque: 330 },
  { brand: "Audi", model: "A4", generation: "B8 (2008-2015)", engine: "2.0 TDI", variant: "120hp", vehicleType: "car", originalPower: 120, originalTorque: 280, stage1Power: 150, stage1Torque: 330, stage2Power: 170, stage2Torque: 360 },
  { brand: "Audi", model: "A4", generation: "B8 (2008-2015)", engine: "2.0 TDI", variant: "143hp", vehicleType: "car", originalPower: 143, originalTorque: 320, stage1Power: 175, stage1Torque: 375, stage2Power: 200, stage2Torque: 410 },
  { brand: "Audi", model: "A4", generation: "B8 (2008-2015)", engine: "2.0 TDI", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 380, stage1Power: 215, stage1Torque: 440, stage2Power: 245, stage2Torque: 480 },
  { brand: "Audi", model: "A4", generation: "B8 (2008-2015)", engine: "3.0 TDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "Audi", model: "A4", generation: "B8 (2008-2015)", engine: "3.0 TDI", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 500, stage1Power: 295, stage1Torque: 590, stage2Power: 335, stage2Torque: 650 },
  { brand: "Audi", model: "A4", generation: "B9 (2015-2023)", engine: "1.4 TFSI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 250, stage1Power: 185, stage1Torque: 300, stage2Power: 210, stage2Torque: 330 },
  { brand: "Audi", model: "A4", generation: "B9 (2015-2023)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  { brand: "Audi", model: "A4", generation: "B9 (2015-2023)", engine: "2.0 TDI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  { brand: "Audi", model: "A4", generation: "B9 (2015-2023)", engine: "2.0 TFSI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 320, stage1Power: 230, stage1Torque: 380, stage2Power: 270, stage2Torque: 420 },
  { brand: "Audi", model: "A4", generation: "B9 (2015-2023)", engine: "2.0 TFSI", variant: "252hp", vehicleType: "car", originalPower: 252, originalTorque: 370, stage1Power: 300, stage1Torque: 430, stage2Power: 340, stage2Torque: 480 },
  { brand: "Audi", model: "A4", generation: "B9 (2015-2023)", engine: "3.0 TDI", variant: "218hp", vehicleType: "car", originalPower: 218, originalTorque: 400, stage1Power: 260, stage1Torque: 480, stage2Power: 295, stage2Torque: 520 },
  { brand: "Audi", model: "A4", generation: "B9 (2015-2023)", engine: "3.0 TDI", variant: "286hp", vehicleType: "car", originalPower: 286, originalTorque: 620, stage1Power: 340, stage1Torque: 720, stage2Power: 380, stage2Torque: 780 },
  
  // A5 Series
  { brand: "Audi", model: "A5", generation: "8T (2007-2016)", engine: "2.0 TDI", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 380, stage1Power: 215, stage1Torque: 440, stage2Power: 245, stage2Torque: 480 },
  { brand: "Audi", model: "A5", generation: "8T (2007-2016)", engine: "3.0 TDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "Audi", model: "A5", generation: "8T (2007-2016)", engine: "3.0 TDI", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 500, stage1Power: 295, stage1Torque: 590, stage2Power: 335, stage2Torque: 650 },
  { brand: "Audi", model: "A5", generation: "F5 (2016-2024)", engine: "2.0 TDI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  { brand: "Audi", model: "A5", generation: "F5 (2016-2024)", engine: "2.0 TFSI", variant: "252hp", vehicleType: "car", originalPower: 252, originalTorque: 370, stage1Power: 300, stage1Torque: 430, stage2Power: 340, stage2Torque: 480 },
  { brand: "Audi", model: "A5", generation: "F5 (2016-2024)", engine: "3.0 TDI", variant: "286hp", vehicleType: "car", originalPower: 286, originalTorque: 620, stage1Power: 340, stage1Torque: 720, stage2Power: 380, stage2Torque: 780 },
  
  // A6 Series
  { brand: "Audi", model: "A6", generation: "C5 (1997-2005)", engine: "2.5 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 310, stage1Power: 185, stage1Torque: 370, stage2Power: 210, stage2Torque: 410 },
  { brand: "Audi", model: "A6", generation: "C5 (1997-2005)", engine: "2.5 TDI", variant: "180hp", vehicleType: "car", originalPower: 180, originalTorque: 370, stage1Power: 220, stage1Torque: 440, stage2Power: 250, stage2Torque: 480 },
  { brand: "Audi", model: "A6", generation: "C6 (2004-2011)", engine: "2.0 TDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Audi", model: "A6", generation: "C6 (2004-2011)", engine: "2.7 TDI", variant: "180hp", vehicleType: "car", originalPower: 180, originalTorque: 380, stage1Power: 220, stage1Torque: 450, stage2Power: 250, stage2Torque: 490 },
  { brand: "Audi", model: "A6", generation: "C6 (2004-2011)", engine: "3.0 TDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "Audi", model: "A6", generation: "C6 (2004-2011)", engine: "3.0 TDI", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 500, stage1Power: 295, stage1Torque: 590, stage2Power: 335, stage2Torque: 650 },
  { brand: "Audi", model: "A6", generation: "C7 (2011-2018)", engine: "2.0 TDI", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 380, stage1Power: 215, stage1Torque: 440, stage2Power: 245, stage2Torque: 480 },
  { brand: "Audi", model: "A6", generation: "C7 (2011-2018)", engine: "2.0 TDI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  { brand: "Audi", model: "A6", generation: "C7 (2011-2018)", engine: "3.0 TDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "Audi", model: "A6", generation: "C7 (2011-2018)", engine: "3.0 TDI", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 500, stage1Power: 295, stage1Torque: 590, stage2Power: 335, stage2Torque: 650 },
  { brand: "Audi", model: "A6", generation: "C7 (2011-2018)", engine: "3.0 TDI", variant: "272hp", vehicleType: "car", originalPower: 272, originalTorque: 600, stage1Power: 320, stage1Torque: 700, stage2Power: 360, stage2Torque: 750 },
  { brand: "Audi", model: "A6", generation: "C7 (2011-2018)", engine: "3.0 TDI", variant: "320hp", vehicleType: "car", originalPower: 320, originalTorque: 650, stage1Power: 375, stage1Torque: 750, stage2Power: 420, stage2Torque: 820 },
  { brand: "Audi", model: "A6", generation: "C8 (2018-2024)", engine: "2.0 TDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "Audi", model: "A6", generation: "C8 (2018-2024)", engine: "3.0 TDI", variant: "231hp", vehicleType: "car", originalPower: 231, originalTorque: 500, stage1Power: 275, stage1Torque: 590, stage2Power: 315, stage2Torque: 650 },
  { brand: "Audi", model: "A6", generation: "C8 (2018-2024)", engine: "3.0 TDI", variant: "286hp", vehicleType: "car", originalPower: 286, originalTorque: 620, stage1Power: 340, stage1Torque: 720, stage2Power: 380, stage2Torque: 780 },
  { brand: "Audi", model: "A6", generation: "C8 (2018-2024)", engine: "3.0 TDI", variant: "349hp", vehicleType: "car", originalPower: 349, originalTorque: 700, stage1Power: 410, stage1Torque: 810, stage2Power: 460, stage2Torque: 880 },
  
  // A7 Series
  { brand: "Audi", model: "A7", generation: "4G (2010-2018)", engine: "3.0 TDI", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 500, stage1Power: 295, stage1Torque: 590, stage2Power: 335, stage2Torque: 650 },
  { brand: "Audi", model: "A7", generation: "4G (2010-2018)", engine: "3.0 TDI", variant: "272hp", vehicleType: "car", originalPower: 272, originalTorque: 600, stage1Power: 320, stage1Torque: 700, stage2Power: 360, stage2Torque: 750 },
  { brand: "Audi", model: "A7", generation: "4G (2010-2018)", engine: "3.0 TDI", variant: "320hp", vehicleType: "car", originalPower: 320, originalTorque: 650, stage1Power: 375, stage1Torque: 750, stage2Power: 420, stage2Torque: 820 },
  { brand: "Audi", model: "A7", generation: "4K (2018-2024)", engine: "3.0 TDI", variant: "286hp", vehicleType: "car", originalPower: 286, originalTorque: 620, stage1Power: 340, stage1Torque: 720, stage2Power: 380, stage2Torque: 780 },
  { brand: "Audi", model: "A7", generation: "4K (2018-2024)", engine: "3.0 TDI", variant: "349hp", vehicleType: "car", originalPower: 349, originalTorque: 700, stage1Power: 410, stage1Torque: 810, stage2Power: 460, stage2Torque: 880 },
  
  // A8 Series
  { brand: "Audi", model: "A8", generation: "D3 (2002-2010)", engine: "3.0 TDI", variant: "233hp", vehicleType: "car", originalPower: 233, originalTorque: 450, stage1Power: 280, stage1Torque: 530, stage2Power: 320, stage2Torque: 580 },
  { brand: "Audi", model: "A8", generation: "D3 (2002-2010)", engine: "4.2 TDI", variant: "326hp", vehicleType: "car", originalPower: 326, originalTorque: 650, stage1Power: 385, stage1Torque: 750, stage2Power: 435, stage2Torque: 820 },
  { brand: "Audi", model: "A8", generation: "D4 (2010-2017)", engine: "3.0 TDI", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 500, stage1Power: 295, stage1Torque: 590, stage2Power: 335, stage2Torque: 650 },
  { brand: "Audi", model: "A8", generation: "D4 (2010-2017)", engine: "3.0 TDI", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 580, stage1Power: 310, stage1Torque: 680, stage2Power: 350, stage2Torque: 740 },
  { brand: "Audi", model: "A8", generation: "D4 (2010-2017)", engine: "4.2 TDI", variant: "385hp", vehicleType: "car", originalPower: 385, originalTorque: 850, stage1Power: 450, stage1Torque: 980, stage2Power: 510, stage2Torque: 1080 },
  { brand: "Audi", model: "A8", generation: "D5 (2017-2024)", engine: "3.0 TDI", variant: "286hp", vehicleType: "car", originalPower: 286, originalTorque: 620, stage1Power: 340, stage1Torque: 720, stage2Power: 380, stage2Torque: 780 },
  { brand: "Audi", model: "A8", generation: "D5 (2017-2024)", engine: "4.0 TDI", variant: "435hp", vehicleType: "car", originalPower: 435, originalTorque: 900, stage1Power: 510, stage1Torque: 1040, stage2Power: 580, stage2Torque: 1150 },

  // Q Series SUVs
  // Q1/Q2 Compact SUVs
  { brand: "Audi", model: "Q2", generation: "GA (2016-2024)", engine: "1.0 TFSI", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 200, stage1Power: 140, stage1Torque: 240, stage2Power: 160, stage2Torque: 270 },
  { brand: "Audi", model: "Q2", generation: "GA (2016-2024)", engine: "1.4 TFSI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 250, stage1Power: 185, stage1Torque: 300, stage2Power: 210, stage2Torque: 330 },
  { brand: "Audi", model: "Q2", generation: "GA (2016-2024)", engine: "1.6 TDI", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 250, stage1Power: 145, stage1Torque: 300, stage2Power: 165, stage2Torque: 330 },
  
  // Q3 Compact SUV
  { brand: "Audi", model: "Q3", generation: "8U (2011-2018)", engine: "2.0 TDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Audi", model: "Q3", generation: "8U (2011-2018)", engine: "2.0 TDI", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 380, stage1Power: 215, stage1Torque: 440, stage2Power: 245, stage2Torque: 480 },
  { brand: "Audi", model: "Q3", generation: "F3 (2018-2024)", engine: "1.5 TFSI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 250, stage1Power: 185, stage1Torque: 300, stage2Power: 210, stage2Torque: 330 },
  { brand: "Audi", model: "Q3", generation: "F3 (2018-2024)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 340, stage1Power: 190, stage1Torque: 400, stage2Power: 220, stage2Torque: 440 },
  { brand: "Audi", model: "Q3", generation: "F3 (2018-2024)", engine: "2.0 TFSI", variant: "230hp", vehicleType: "car", originalPower: 230, originalTorque: 320, stage1Power: 275, stage1Torque: 380, stage2Power: 310, stage2Torque: 420 },
  
  // Q5 Mid-size SUV
  { brand: "Audi", model: "Q5", generation: "8R (2008-2017)", engine: "2.0 TDI", variant: "143hp", vehicleType: "car", originalPower: 143, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Audi", model: "Q5", generation: "8R (2008-2017)", engine: "2.0 TDI", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 380, stage1Power: 215, stage1Torque: 440, stage2Power: 245, stage2Torque: 480 },
  { brand: "Audi", model: "Q5", generation: "8R (2008-2017)", engine: "3.0 TDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "Audi", model: "Q5", generation: "8R (2008-2017)", engine: "3.0 TDI", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 500, stage1Power: 295, stage1Torque: 590, stage2Power: 335, stage2Torque: 650 },
  { brand: "Audi", model: "Q5", generation: "FY (2017-2024)", engine: "2.0 TDI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  { brand: "Audi", model: "Q5", generation: "FY (2017-2024)", engine: "2.0 TFSI", variant: "252hp", vehicleType: "car", originalPower: 252, originalTorque: 370, stage1Power: 300, stage1Torque: 430, stage2Power: 340, stage2Torque: 480 },
  { brand: "Audi", model: "Q5", generation: "FY (2017-2024)", engine: "3.0 TDI", variant: "286hp", vehicleType: "car", originalPower: 286, originalTorque: 620, stage1Power: 340, stage1Torque: 720, stage2Power: 380, stage2Torque: 780 },
  
  // Q7 Full-size SUV
  { brand: "Audi", model: "Q7", generation: "4L (2005-2015)", engine: "3.0 TDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "Audi", model: "Q7", generation: "4L (2005-2015)", engine: "3.0 TDI", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 500, stage1Power: 295, stage1Torque: 590, stage2Power: 335, stage2Torque: 650 },
  { brand: "Audi", model: "Q7", generation: "4L (2005-2015)", engine: "3.0 TDI", variant: "272hp", vehicleType: "car", originalPower: 272, originalTorque: 600, stage1Power: 320, stage1Torque: 700, stage2Power: 360, stage2Torque: 750 },
  { brand: "Audi", model: "Q7", generation: "4L (2005-2015)", engine: "4.2 TDI", variant: "340hp", vehicleType: "car", originalPower: 340, originalTorque: 760, stage1Power: 400, stage1Torque: 880, stage2Power: 450, stage2Torque: 960 },
  { brand: "Audi", model: "Q7", generation: "4M (2015-2024)", engine: "3.0 TDI", variant: "218hp", vehicleType: "car", originalPower: 218, originalTorque: 500, stage1Power: 260, stage1Torque: 590, stage2Power: 295, stage2Torque: 650 },
  { brand: "Audi", model: "Q7", generation: "4M (2015-2024)", engine: "3.0 TDI", variant: "286hp", vehicleType: "car", originalPower: 286, originalTorque: 620, stage1Power: 340, stage1Torque: 720, stage2Power: 380, stage2Torque: 780 },
  { brand: "Audi", model: "Q7", generation: "4M (2015-2024)", engine: "4.0 TDI", variant: "435hp", vehicleType: "car", originalPower: 435, originalTorque: 900, stage1Power: 510, stage1Torque: 1040, stage2Power: 580, stage2Torque: 1150 },
  
  // Q8 Luxury SUV
  { brand: "Audi", model: "Q8", generation: "4M (2018-2024)", engine: "3.0 TDI", variant: "286hp", vehicleType: "car", originalPower: 286, originalTorque: 620, stage1Power: 340, stage1Torque: 720, stage2Power: 380, stage2Torque: 780 },
  { brand: "Audi", model: "Q8", generation: "4M (2018-2024)", engine: "4.0 TDI", variant: "435hp", vehicleType: "car", originalPower: 435, originalTorque: 900, stage1Power: 510, stage1Torque: 1040, stage2Power: 580, stage2Torque: 1150 },
  
  // TT Sports Car
  { brand: "Audi", model: "TT", generation: "8J (2006-2014)", engine: "2.0 TDI", variant: "170hp", vehicleType: "car", originalPower: 170, originalTorque: 350, stage1Power: 210, stage1Torque: 420, stage2Power: 240, stage2Torque: 460 },
  { brand: "Audi", model: "TT", generation: "8S (2014-2023)", engine: "2.0 TFSI", variant: "230hp", vehicleType: "car", originalPower: 230, originalTorque: 370, stage1Power: 275, stage1Torque: 430, stage2Power: 310, stage2Torque: 480 },
  { brand: "Audi", model: "TT", generation: "8S (2014-2023)", engine: "2.5 TFSI", variant: "400hp", vehicleType: "car", originalPower: 400, originalTorque: 480, stage1Power: 450, stage1Torque: 540, stage2Power: 500, stage2Torque: 590 },
  
  // R8 Supercar
  { brand: "Audi", model: "R8", generation: "42 (2007-2015)", engine: "5.2 V10", variant: "525hp", vehicleType: "car", originalPower: 525, originalTorque: 530, stage1Power: 580, stage1Torque: 590, stage2Power: 630, stage2Torque: 640 },
  { brand: "Audi", model: "R8", generation: "4S (2015-2023)", engine: "5.2 V10", variant: "540hp", vehicleType: "car", originalPower: 540, originalTorque: 540, stage1Power: 600, stage1Torque: 600, stage2Power: 650, stage2Torque: 650 },
  { brand: "Audi", model: "R8", generation: "4S (2015-2023)", engine: "5.2 V10", variant: "610hp", vehicleType: "car", originalPower: 610, originalTorque: 560, stage1Power: 670, stage1Torque: 620, stage2Power: 720, stage2Torque: 670 },
  
  // BMW - Bavarian Motor Works
  // 1 Series
  { brand: "BMW", model: "1 Series", generation: "E81/E87 (2004-2013)", engine: "2.0d", variant: "143hp", vehicleType: "car", originalPower: 143, originalTorque: 300, stage1Power: 180, stage1Torque: 360, stage2Power: 205, stage2Torque: 400 },
  { brand: "BMW", model: "1 Series", generation: "F20/F21 (2011-2019)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // 3 Series
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "2.0d", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 350, stage1Power: 215, stage1Torque: 420, stage2Power: 245, stage2Torque: 460 },
  { brand: "BMW", model: "3 Series", generation: "F30/F31/F34 (2012-2019)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  { brand: "BMW", model: "3 Series", generation: "F30/F31/F34 (2012-2019)", engine: "3.0d", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 560, stage1Power: 310, stage1Torque: 650, stage2Power: 350, stage2Torque: 720 },
  { brand: "BMW", model: "3 Series", generation: "G20/G21 (2019-2024)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // 5 Series
  { brand: "BMW", model: "5 Series", generation: "F10/F11 (2010-2017)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  { brand: "BMW", model: "5 Series", generation: "F10/F11 (2010-2017)", engine: "3.0d", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 560, stage1Power: 310, stage1Torque: 650, stage2Power: 350, stage2Torque: 720 },
  { brand: "BMW", model: "5 Series", generation: "G30/G31 (2017-2024)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // X Series SUVs
  { brand: "BMW", model: "X3", generation: "F25 (2010-2017)", engine: "3.0d", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 560, stage1Power: 310, stage1Torque: 650, stage2Power: 350, stage2Torque: 720 },
  { brand: "BMW", model: "X5", generation: "E70 (2006-2013)", engine: "3.0d", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 540, stage1Power: 295, stage1Torque: 620, stage2Power: 335, stage2Torque: 680 },
  
  // MERCEDES-BENZ - German Luxury
  // A-Class
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W176 (2012-2018)", engine: "2.0 CDI", variant: "136hp", vehicleType: "car", originalPower: 136, originalTorque: 300, stage1Power: 170, stage1Torque: 360, stage2Power: 195, stage2Torque: 400 },
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W177 (2018-2024)", engine: "2.0d", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  
  // C-Class
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W204 (2007-2014)", engine: "2.2 CDI", variant: "170hp", vehicleType: "car", originalPower: 170, originalTorque: 400, stage1Power: 210, stage1Torque: 470, stage2Power: 240, stage2Torque: 510 },
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W205 (2014-2021)", engine: "2.2 CDI", variant: "194hp", vehicleType: "car", originalPower: 194, originalTorque: 400, stage1Power: 240, stage1Torque: 480, stage2Power: 275, stage2Torque: 520 },
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W206 (2021-2024)", engine: "2.0d", variant: "200hp", vehicleType: "car", originalPower: 200, originalTorque: 440, stage1Power: 250, stage1Torque: 520, stage2Power: 285, stage2Torque: 570 },
  
  // E-Class
  { brand: "Mercedes-Benz", model: "E-Class", generation: "W212 (2009-2016)", engine: "3.0 CDI", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 620, stage1Power: 310, stage1Torque: 720, stage2Power: 350, stage2Torque: 780 },
  { brand: "Mercedes-Benz", model: "E-Class", generation: "W213 (2016-2024)", engine: "2.0d", variant: "194hp", vehicleType: "car", originalPower: 194, originalTorque: 400, stage1Power: 240, stage1Torque: 480, stage2Power: 275, stage2Torque: 520 },
  
  // GL/GLE SUVs
  { brand: "Mercedes-Benz", model: "GL-Class", generation: "X164 (2006-2012)", engine: "3.0 CDI", variant: "224hp", vehicleType: "car", originalPower: 224, originalTorque: 540, stage1Power: 270, stage1Torque: 620, stage2Power: 305, stage2Torque: 680 },
  { brand: "Mercedes-Benz", model: "GLE", generation: "W166 (2015-2019)", engine: "3.0 CDI", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 620, stage1Power: 310, stage1Torque: 720, stage2Power: 350, stage2Torque: 780 },
  
  // VOLKSWAGEN - People's Car
  // Golf
  { brand: "Volkswagen", model: "Golf", generation: "MK6 (2008-2013)", engine: "2.0 TDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Volkswagen", model: "Golf", generation: "MK7 (2012-2020)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  { brand: "Volkswagen", model: "Golf", generation: "MK7 (2012-2020)", engine: "1.4 TSI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 250, stage1Power: 185, stage1Torque: 290, stage2Power: 210, stage2Torque: 320 },
  { brand: "Volkswagen", model: "Golf", generation: "MK8 (2019-2024)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 360, stage1Power: 190, stage1Torque: 420, stage2Power: 220, stage2Torque: 460 },
  
  // Passat
  { brand: "Volkswagen", model: "Passat", generation: "B7 (2010-2015)", engine: "2.0 TDI", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 380, stage1Power: 215, stage1Torque: 440, stage2Power: 245, stage2Torque: 480 },
  { brand: "Volkswagen", model: "Passat", generation: "B8 (2014-2023)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 340, stage1Power: 190, stage1Torque: 400, stage2Power: 220, stage2Torque: 440 },
  { brand: "Volkswagen", model: "Passat", generation: "B8 (2014-2023)", engine: "2.0 TDI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // Tiguan
  { brand: "Volkswagen", model: "Tiguan", generation: "5N (2007-2016)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  { brand: "Volkswagen", model: "Tiguan", generation: "5N (2007-2016)", engine: "2.0 TDI", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 380, stage1Power: 215, stage1Torque: 440, stage2Power: 245, stage2Torque: 480 },
  
  // SKODA - Czech Value Brand
  // Octavia
  { brand: "Skoda", model: "Octavia", generation: "MK2 (2004-2013)", engine: "2.0 TDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Skoda", model: "Octavia", generation: "MK3 (2012-2020)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  { brand: "Skoda", model: "Octavia", generation: "MK4 (2019-2024)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 360, stage1Power: 190, stage1Torque: 420, stage2Power: 220, stage2Torque: 460 },
  
  // Superb
  { brand: "Skoda", model: "Superb", generation: "B6 (2008-2015)", engine: "2.0 TDI", variant: "170hp", vehicleType: "car", originalPower: 170, originalTorque: 350, stage1Power: 210, stage1Torque: 420, stage2Power: 240, stage2Torque: 460 },
  { brand: "Skoda", model: "Superb", generation: "B8 (2015-2023)", engine: "2.0 TDI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // SEAT - Spanish Sport Brand
  // Leon
  { brand: "Seat", model: "Leon", generation: "MK2 (2005-2013)", engine: "2.0 TDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Seat", model: "Leon", generation: "MK3 (2012-2020)", engine: "2.0 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  
  // FORD - American in Europe
  // Focus
  { brand: "Ford", model: "Focus", generation: "MK3 (2010-2018)", engine: "2.0 TDCi", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 185, stage1Torque: 380, stage2Power: 215, stage2Torque: 420 },
  { brand: "Ford", model: "Focus", generation: "MK4 (2018-2024)", engine: "2.0 EcoBlue", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 370, stage1Power: 185, stage1Torque: 430, stage2Power: 215, stage2Torque: 470 },
  
  // Mondeo
  { brand: "Ford", model: "Mondeo", generation: "MK4 (2007-2014)", engine: "2.0 TDCi", variant: "163hp", vehicleType: "car", originalPower: 163, originalTorque: 340, stage1Power: 200, stage1Torque: 400, stage2Power: 230, stage2Torque: 440 },
  { brand: "Ford", model: "Mondeo", generation: "MK5 (2014-2022)", engine: "2.0 TDCi", variant: "180hp", vehicleType: "car", originalPower: 180, originalTorque: 400, stage1Power: 220, stage1Torque: 470, stage2Power: 250, stage2Torque: 510 },
  
  // Kuga
  { brand: "Ford", model: "Kuga", generation: "MK2 (2012-2019)", engine: "2.0 TDCi", variant: "180hp", vehicleType: "car", originalPower: 180, originalTorque: 400, stage1Power: 220, stage1Torque: 470, stage2Power: 250, stage2Torque: 510 },
  
  // OPEL/VAUXHALL - German/British
  // Astra
  { brand: "Opel", model: "Astra", generation: "J (2009-2015)", engine: "2.0 CDTI", variant: "165hp", vehicleType: "car", originalPower: 165, originalTorque: 350, stage1Power: 200, stage1Torque: 420, stage2Power: 230, stage2Torque: 460 },
  { brand: "Opel", model: "Astra", generation: "K (2015-2022)", engine: "1.6 CDTI", variant: "136hp", vehicleType: "car", originalPower: 136, originalTorque: 320, stage1Power: 170, stage1Torque: 380, stage2Power: 195, stage2Torque: 420 },
  
  // Insignia
  { brand: "Opel", model: "Insignia", generation: "A (2008-2017)", engine: "2.0 CDTI", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // PEUGEOT - French Style
  // 308
  { brand: "Peugeot", model: "308", generation: "T7 (2007-2014)", engine: "2.0 HDi", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 340, stage1Power: 185, stage1Torque: 400, stage2Power: 215, stage2Torque: 440 },
  { brand: "Peugeot", model: "308", generation: "T9 (2013-2021)", engine: "2.0 BlueHDi", variant: "180hp", vehicleType: "car", originalPower: 180, originalTorque: 400, stage1Power: 220, stage1Torque: 470, stage2Power: 250, stage2Torque: 510 },
  
  // 508
  { brand: "Peugeot", model: "508", generation: "8D (2010-2018)", engine: "2.0 HDi", variant: "163hp", vehicleType: "car", originalPower: 163, originalTorque: 340, stage1Power: 200, stage1Torque: 400, stage2Power: 230, stage2Torque: 440 },
  
  // CITROEN - French Comfort
  // C4
  { brand: "Citroen", model: "C4", generation: "B7 (2010-2018)", engine: "2.0 HDi", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 340, stage1Power: 185, stage1Torque: 400, stage2Power: 215, stage2Torque: 440 },
  
  // C5
  { brand: "Citroen", model: "C5", generation: "X7 (2008-2017)", engine: "2.0 HDi", variant: "163hp", vehicleType: "car", originalPower: 163, originalTorque: 340, stage1Power: 200, stage1Torque: 400, stage2Power: 230, stage2Torque: 440 },
  
  // RENAULT - French Engineering
  // Megane
  { brand: "Renault", model: "Megane", generation: "III (2008-2016)", engine: "1.6 dCi", variant: "130hp", vehicleType: "car", originalPower: 130, originalTorque: 320, stage1Power: 165, stage1Torque: 380, stage2Power: 190, stage2Torque: 420 },
  { brand: "Renault", model: "Megane", generation: "IV (2015-2022)", engine: "1.6 dCi", variant: "130hp", vehicleType: "car", originalPower: 130, originalTorque: 320, stage1Power: 165, stage1Torque: 380, stage2Power: 190, stage2Torque: 420 },
  
  // Laguna
  { brand: "Renault", model: "Laguna", generation: "III (2007-2015)", engine: "2.0 dCi", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 185, stage1Torque: 380, stage2Power: 215, stage2Torque: 420 },
  
  // FIAT - Italian Passion
  // Bravo
  { brand: "Fiat", model: "Bravo", generation: "198 (2007-2014)", engine: "1.9 JTD", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 305, stage1Power: 185, stage1Torque: 365, stage2Power: 215, stage2Torque: 400 },
  

  // === AMERICAN BRANDS ===
  
  // CHEVROLET - American Power
  // Cruze
  { brand: "Chevrolet", model: "Cruze", generation: "J300 (2008-2016)", engine: "2.0 VCDi", variant: "163hp", vehicleType: "car", originalPower: 163, originalTorque: 360, stage1Power: 200, stage1Torque: 420, stage2Power: 230, stage2Torque: 460 },
  
  // Captiva
  { brand: "Chevrolet", model: "Captiva", generation: "C100/C140 (2006-2018)", engine: "2.2 VCDi", variant: "184hp", vehicleType: "car", originalPower: 184, originalTorque: 400, stage1Power: 225, stage1Torque: 470, stage2Power: 255, stage2Torque: 510 },
  
  // === TRUCKS ===
  
  // MERCEDES-BENZ Trucks
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "12.8L OM471", variant: "449hp", vehicleType: "truck", originalPower: 449, originalTorque: 2200, stage1Power: 520, stage1Torque: 2500, stage2Power: 580, stage2Torque: 2700 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "12.8L OM471", variant: "476hp", vehicleType: "truck", originalPower: 476, originalTorque: 2300, stage1Power: 550, stage1Torque: 2600, stage2Power: 610, stage2Torque: 2800 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "III (2013-2024)", engine: "7.7L OM936", variant: "292hp", vehicleType: "truck", originalPower: 292, originalTorque: 1200, stage1Power: 340, stage1Torque: 1400, stage2Power: 380, stage2Torque: 1500 },
  
  // MAN Trucks
  { brand: "MAN", model: "TGX", generation: "XXL (2007-2020)", engine: "12.4L D2676", variant: "480hp", vehicleType: "truck", originalPower: 480, originalTorque: 2300, stage1Power: 560, stage1Torque: 2650, stage2Power: 620, stage2Torque: 2850 },
  { brand: "MAN", model: "TGS", generation: "(2007-2020)", engine: "10.5L D2066", variant: "400hp", vehicleType: "truck", originalPower: 400, originalTorque: 1900, stage1Power: 460, stage1Torque: 2200, stage2Power: 510, stage2Torque: 2400 },
  { brand: "MAN", model: "TGL", generation: "(2005-2024)", engine: "6.9L D0836", variant: "250hp", vehicleType: "truck", originalPower: 250, originalTorque: 1000, stage1Power: 290, stage1Torque: 1150, stage2Power: 320, stage2Torque: 1250 },
  
  // VOLVO Trucks
  { brand: "Volvo", model: "FH", generation: "4th Gen (2012-2024)", engine: "12.8L D13K", variant: "460hp", vehicleType: "truck", originalPower: 460, originalTorque: 2300, stage1Power: 530, stage1Torque: 2600, stage2Power: 590, stage2Torque: 2800 },
  { brand: "Volvo", model: "FH", generation: "4th Gen (2012-2024)", engine: "12.8L D13K", variant: "500hp", vehicleType: "truck", originalPower: 500, originalTorque: 2500, stage1Power: 580, stage1Torque: 2850, stage2Power: 640, stage2Torque: 3050 },
  { brand: "Volvo", model: "FM", generation: "4th Gen (2013-2024)", engine: "10.8L D11K", variant: "370hp", vehicleType: "truck", originalPower: 370, originalTorque: 1700, stage1Power: 430, stage1Torque: 1950, stage2Power: 480, stage2Torque: 2150 },
  
  // SCANIA Trucks
  { brand: "Scania", model: "R", generation: "6th Gen (2016-2024)", engine: "12.7L DC13", variant: "450hp", vehicleType: "truck", originalPower: 450, originalTorque: 2350, stage1Power: 520, stage1Torque: 2700, stage2Power: 580, stage2Torque: 2900 },
  { brand: "Scania", model: "S", generation: "6th Gen (2016-2024)", engine: "12.7L DC13", variant: "500hp", vehicleType: "truck", originalPower: 500, originalTorque: 2550, stage1Power: 580, stage1Torque: 2900, stage2Power: 640, stage2Torque: 3100 },
  { brand: "Scania", model: "P", generation: "6th Gen (2016-2024)", engine: "9.3L DC09", variant: "320hp", vehicleType: "truck", originalPower: 320, originalTorque: 1400, stage1Power: 370, stage1Torque: 1600, stage2Power: 410, stage2Torque: 1750 },
  
  // DAF Trucks
  { brand: "DAF", model: "XF", generation: "106 (2013-2021)", engine: "12.9L MX-13", variant: "480hp", vehicleType: "truck", originalPower: 480, originalTorque: 2300, stage1Power: 560, stage1Torque: 2650, stage2Power: 620, stage2Torque: 2850 },
  { brand: "DAF", model: "CF", generation: "85 (2013-2021)", engine: "9.2L MX-11", variant: "340hp", vehicleType: "truck", originalPower: 340, originalTorque: 1600, stage1Power: 395, stage1Torque: 1850, stage2Power: 440, stage2Torque: 2000 },
  { brand: "DAF", model: "LF", generation: "45 (2013-2021)", engine: "6.7L PX-7", variant: "250hp", vehicleType: "truck", originalPower: 250, originalTorque: 1000, stage1Power: 290, stage1Torque: 1150, stage2Power: 320, stage2Torque: 1250 },
  
  // IVECO Trucks
  { brand: "Iveco", model: "Stralis", generation: "Hi-Way (2012-2019)", engine: "12.9L Cursor 13", variant: "460hp", vehicleType: "truck", originalPower: 460, originalTorque: 2100, stage1Power: 530, stage1Torque: 2400, stage2Power: 590, stage2Torque: 2600 },
  { brand: "Iveco", model: "Eurocargo", generation: "III (2008-2024)", engine: "7.8L Tector 7", variant: "320hp", vehicleType: "truck", originalPower: 320, originalTorque: 1300, stage1Power: 370, stage1Torque: 1500, stage2Power: 410, stage2Torque: 1650 },
  
  // === TRACTORS ===
  
  // JOHN DEERE Tractors
  { brand: "John Deere", model: "6R Series", generation: "6150R (2017-2024)", engine: "6.8L PowerTech", variant: "150hp", vehicleType: "tractor", originalPower: 150, originalTorque: 650, stage1Power: 180, stage1Torque: 750, stage2Power: 200, stage2Torque: 820 },
  { brand: "John Deere", model: "7R Series", generation: "7230R (2017-2024)", engine: "9.0L PowerTech", variant: "230hp", vehicleType: "tractor", originalPower: 230, originalTorque: 1000, stage1Power: 270, stage1Torque: 1150, stage2Power: 300, stage2Torque: 1250 },
  { brand: "John Deere", model: "8R Series", generation: "8370R (2017-2024)", engine: "13.5L PowerTech", variant: "370hp", vehicleType: "tractor", originalPower: 370, originalTorque: 1600, stage1Power: 430, stage1Torque: 1850, stage2Power: 480, stage2Torque: 2000 },
  
  // CASE IH Tractors
  { brand: "Case IH", model: "Puma", generation: "160 CVX (2018-2024)", engine: "6.7L FPT", variant: "160hp", vehicleType: "tractor", originalPower: 160, originalTorque: 700, stage1Power: 190, stage1Torque: 800, stage2Power: 210, stage2Torque: 870 },
  { brand: "Case IH", model: "Optum", generation: "270 CVX (2018-2024)", engine: "8.7L FPT", variant: "270hp", vehicleType: "tractor", originalPower: 270, originalTorque: 1200, stage1Power: 320, stage1Torque: 1400, stage2Power: 360, stage2Torque: 1550 },
  { brand: "Case IH", model: "Magnum", generation: "380 CVX (2018-2024)", engine: "12.9L FPT", variant: "380hp", vehicleType: "tractor", originalPower: 380, originalTorque: 1700, stage1Power: 450, stage1Torque: 1950, stage2Power: 500, stage2Torque: 2100 },
  
  // NEW HOLLAND Tractors
  { brand: "New Holland", model: "T6", generation: "T6.155 (2018-2024)", engine: "6.7L FPT", variant: "155hp", vehicleType: "tractor", originalPower: 155, originalTorque: 680, stage1Power: 185, stage1Torque: 780, stage2Power: 205, stage2Torque: 850 },
  { brand: "New Holland", model: "T7", generation: "T7.270 (2018-2024)", engine: "8.7L FPT", variant: "270hp", vehicleType: "tractor", originalPower: 270, originalTorque: 1200, stage1Power: 320, stage1Torque: 1400, stage2Power: 360, stage2Torque: 1550 },
  { brand: "New Holland", model: "T8", generation: "T8.410 (2018-2024)", engine: "12.9L FPT", variant: "410hp", vehicleType: "tractor", originalPower: 410, originalTorque: 1850, stage1Power: 480, stage1Torque: 2100, stage2Power: 530, stage2Torque: 2250 },
  
  // FENDT Tractors
  { brand: "Fendt", model: "700 Vario", generation: "724 (2017-2024)", engine: "7.8L AGCO Power", variant: "240hp", vehicleType: "tractor", originalPower: 240, originalTorque: 1050, stage1Power: 280, stage1Torque: 1200, stage2Power: 310, stage2Torque: 1300 },
  { brand: "Fendt", model: "800 Vario", generation: "828 (2017-2024)", engine: "8.4L AGCO Power", variant: "280hp", vehicleType: "tractor", originalPower: 280, originalTorque: 1250, stage1Power: 330, stage1Torque: 1450, stage2Power: 370, stage2Torque: 1600 },
  { brand: "Fendt", model: "900 Vario", generation: "939 (2017-2024)", engine: "12.4L AGCO Power", variant: "390hp", vehicleType: "tractor", originalPower: 390, originalTorque: 1750, stage1Power: 460, stage1Torque: 2000, stage2Power: 510, stage2Torque: 2150 },
  
  // MASSEY FERGUSON Tractors
  { brand: "Massey Ferguson", model: "6700S", generation: "6718S (2018-2024)", engine: "6.6L AGCO Power", variant: "180hp", vehicleType: "tractor", originalPower: 180, originalTorque: 800, stage1Power: 210, stage1Torque: 920, stage2Power: 235, stage2Torque: 1000 },
  { brand: "Massey Ferguson", model: "7700S", generation: "7726S (2018-2024)", engine: "8.4L AGCO Power", variant: "260hp", vehicleType: "tractor", originalPower: 260, originalTorque: 1150, stage1Power: 310, stage1Torque: 1350, stage2Power: 350, stage2Torque: 1500 },
  { brand: "Massey Ferguson", model: "8700S", generation: "8737S (2018-2024)", engine: "8.4L AGCO Power", variant: "370hp", vehicleType: "tractor", originalPower: 370, originalTorque: 1650, stage1Power: 440, stage1Torque: 1900, stage2Power: 490, stage2Torque: 2050 },
  
  // CLAAS Tractors
  { brand: "Claas", model: "Arion 400", generation: "460 (2017-2024)", engine: "6.8L FPT", variant: "160hp", vehicleType: "tractor", originalPower: 160, originalTorque: 700, stage1Power: 190, stage1Torque: 800, stage2Power: 210, stage2Torque: 870 },
  { brand: "Claas", model: "Axion 800", generation: "850 (2017-2024)", engine: "8.7L FPT", variant: "250hp", vehicleType: "tractor", originalPower: 250, originalTorque: 1100, stage1Power: 295, stage1Torque: 1250, stage2Power: 330, stage2Torque: 1350 },
  { brand: "Claas", model: "Xerion 4000", generation: "4500 (2017-2024)", engine: "15.6L Mercedes", variant: "450hp", vehicleType: "tractor", originalPower: 450, originalTorque: 2100, stage1Power: 520, stage1Torque: 2400, stage2Power: 580, stage2Torque: 2600 }
];

export async function populateVehicleDatabase() {
  try {
    // Check if database is already populated
    const existingCount = await db.select({ count: sql`count(*)` }).from(vehicles);
    const currentCount = Number(existingCount[0].count);
    
    if (currentCount < 300) { // Only populate if we have less than 300 vehicles
      console.log(`Current vehicle count: ${currentCount}. Populating database with comprehensive vehicle data...`);
      
      // Clear existing data
      await db.delete(vehicles);
      
      // Insert comprehensive vehicle data in batches for better performance
      const batchSize = 50;
      for (let i = 0; i < comprehensiveVehicleData.length; i += batchSize) {
        const batch = comprehensiveVehicleData.slice(i, i + batchSize);
        await db.insert(vehicles).values(batch);
        console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(comprehensiveVehicleData.length/batchSize)}`);
      }
      
      const finalCount = await db.select({ count: sql`count(*)` }).from(vehicles);
      console.log(`✅ Successfully populated database with ${finalCount[0].count} vehicles`);
      console.log(`📊 Coverage: Cars, Trucks, and Tractors from European and American manufacturers`);
      
    } else {
      console.log(`Database already contains ${currentCount} vehicles. Skipping population.`);
    }
    
  } catch (error) {
    console.error('❌ Error populating vehicle database:', error);
    throw error;
  }
}