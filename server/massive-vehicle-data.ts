import { type InsertVehicle } from "@shared/schema";

// Massive comprehensive vehicle database - European and American only
export const massiveVehicleData: InsertVehicle[] = [
  // === EXTENSIVE AUDI LINEUP ===
  
  // A1 Complete Range
  { brand: "Audi", model: "A1", generation: "8X (2010-2018)", engine: "1.2 TFSI", variant: "86hp", vehicleType: "car", originalPower: 86, originalTorque: 160, stage1Power: 105, stage1Torque: 190, stage2Power: 120, stage2Torque: 215 },
  { brand: "Audi", model: "A1", generation: "8X (2010-2018)", engine: "1.4 TFSI", variant: "122hp", vehicleType: "car", originalPower: 122, originalTorque: 200, stage1Power: 150, stage1Torque: 240, stage2Power: 170, stage2Torque: 270 },
  { brand: "Audi", model: "A1", generation: "8X (2010-2018)", engine: "1.4 TFSI", variant: "185hp", vehicleType: "car", originalPower: 185, originalTorque: 250, stage1Power: 220, stage1Torque: 300, stage2Power: 250, stage2Torque: 330 },
  { brand: "Audi", model: "A1", generation: "8X (2010-2018)", engine: "1.6 TDI", variant: "90hp", vehicleType: "car", originalPower: 90, originalTorque: 230, stage1Power: 115, stage1Torque: 280, stage2Power: 135, stage2Torque: 310 },
  { brand: "Audi", model: "A1", generation: "8X (2010-2018)", engine: "1.6 TDI", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 250, stage1Power: 145, stage1Torque: 300, stage2Power: 165, stage2Torque: 330 },
  
  // A3 Complete Generations
  { brand: "Audi", model: "A3", generation: "8L (1996-2003)", engine: "1.9 TDI", variant: "90hp", vehicleType: "car", originalPower: 90, originalTorque: 210, stage1Power: 115, stage1Torque: 260, stage2Power: 135, stage2Torque: 290 },
  { brand: "Audi", model: "A3", generation: "8L (1996-2003)", engine: "1.9 TDI", variant: "110hp", vehicleType: "car", originalPower: 110, originalTorque: 235, stage1Power: 140, stage1Torque: 285, stage2Power: 160, stage2Torque: 315 },
  { brand: "Audi", model: "A3", generation: "8L (1996-2003)", engine: "1.9 TDI", variant: "130hp", vehicleType: "car", originalPower: 130, originalTorque: 310, stage1Power: 160, stage1Torque: 370, stage2Power: 185, stage2Torque: 410 },
  
  // Comprehensive BMW Range
  { brand: "BMW", model: "1 Series", generation: "E81/E87 (2004-2013)", engine: "1.6i", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 150, stage1Power: 140, stage1Torque: 180, stage2Power: 160, stage2Torque: 200 },
  { brand: "BMW", model: "1 Series", generation: "E81/E87 (2004-2013)", engine: "2.0i", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 200, stage1Power: 180, stage1Torque: 240, stage2Power: 205, stage2Torque: 270 },
  { brand: "BMW", model: "1 Series", generation: "E81/E87 (2004-2013)", engine: "1.6d", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 260, stage1Power: 145, stage1Torque: 310, stage2Power: 165, stage2Torque: 340 },
  { brand: "BMW", model: "1 Series", generation: "E81/E87 (2004-2013)", engine: "2.0d", variant: "143hp", vehicleType: "car", originalPower: 143, originalTorque: 300, stage1Power: 180, stage1Torque: 360, stage2Power: 205, stage2Torque: 400 },
  { brand: "BMW", model: "1 Series", generation: "E81/E87 (2004-2013)", engine: "2.0d", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 350, stage1Power: 215, stage1Torque: 420, stage2Power: 245, stage2Torque: 460 },
  { brand: "BMW", model: "1 Series", generation: "F20/F21 (2011-2019)", engine: "1.6i", variant: "136hp", vehicleType: "car", originalPower: 136, originalTorque: 220, stage1Power: 165, stage1Torque: 270, stage2Power: 190, stage2Torque: 300 },
  { brand: "BMW", model: "1 Series", generation: "F20/F21 (2011-2019)", engine: "2.0i", variant: "184hp", vehicleType: "car", originalPower: 184, originalTorque: 270, stage1Power: 220, stage1Torque: 320, stage2Power: 250, stage2Torque: 360 },
  { brand: "BMW", model: "1 Series", generation: "F20/F21 (2011-2019)", engine: "1.5d", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 270, stage1Power: 145, stage1Torque: 320, stage2Power: 165, stage2Torque: 350 },
  { brand: "BMW", model: "1 Series", generation: "F20/F21 (2011-2019)", engine: "2.0d", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 185, stage1Torque: 380, stage2Power: 215, stage2Torque: 420 },
  { brand: "BMW", model: "1 Series", generation: "F20/F21 (2011-2019)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // BMW 2 Series
  { brand: "BMW", model: "2 Series", generation: "F22/F23 (2013-2021)", engine: "1.5i", variant: "136hp", vehicleType: "car", originalPower: 136, originalTorque: 220, stage1Power: 165, stage1Torque: 270, stage2Power: 190, stage2Torque: 300 },
  { brand: "BMW", model: "2 Series", generation: "F22/F23 (2013-2021)", engine: "2.0i", variant: "184hp", vehicleType: "car", originalPower: 184, originalTorque: 270, stage1Power: 220, stage1Torque: 320, stage2Power: 250, stage2Torque: 360 },
  { brand: "BMW", model: "2 Series", generation: "F22/F23 (2013-2021)", engine: "2.0i", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 350, stage1Power: 290, stage1Torque: 410, stage2Power: 330, stage2Torque: 450 },
  { brand: "BMW", model: "2 Series", generation: "F22/F23 (2013-2021)", engine: "1.5d", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 270, stage1Power: 145, stage1Torque: 320, stage2Power: 165, stage2Torque: 350 },
  { brand: "BMW", model: "2 Series", generation: "F22/F23 (2013-2021)", engine: "2.0d", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 185, stage1Torque: 380, stage2Power: 215, stage2Torque: 420 },
  { brand: "BMW", model: "2 Series", generation: "F22/F23 (2013-2021)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // BMW 3 Series Complete Range
  { brand: "BMW", model: "3 Series", generation: "E46 (1998-2006)", engine: "2.0d", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 330, stage1Power: 185, stage1Torque: 390, stage2Power: 215, stage2Torque: 430 },
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "2.0i", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 200, stage1Power: 180, stage1Torque: 240, stage2Power: 205, stage2Torque: 270 },
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "2.5i", variant: "218hp", vehicleType: "car", originalPower: 218, originalTorque: 250, stage1Power: 260, stage1Torque: 300, stage2Power: 295, stage2Torque: 330 },
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "3.0i", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 300, stage1Power: 310, stage1Torque: 360, stage2Power: 350, stage2Torque: 400 },
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "1.6d", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 260, stage1Power: 145, stage1Torque: 310, stage2Power: 165, stage2Torque: 340 },
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "2.0d", variant: "163hp", vehicleType: "car", originalPower: 163, originalTorque: 340, stage1Power: 200, stage1Torque: 410, stage2Power: 230, stage2Torque: 450 },
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "2.0d", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 350, stage1Power: 215, stage1Torque: 420, stage2Power: 245, stage2Torque: 460 },
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "3.0d", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "BMW", model: "3 Series", generation: "E90/E91/E92 (2005-2013)", engine: "3.0d", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 520, stage1Power: 295, stage1Torque: 610, stage2Power: 335, stage2Torque: 670 },
  
  // BMW 4 Series
  { brand: "BMW", model: "4 Series", generation: "F32/F33/F36 (2013-2020)", engine: "2.0i", variant: "184hp", vehicleType: "car", originalPower: 184, originalTorque: 270, stage1Power: 220, stage1Torque: 320, stage2Power: 250, stage2Torque: 360 },
  { brand: "BMW", model: "4 Series", generation: "F32/F33/F36 (2013-2020)", engine: "2.0i", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 350, stage1Power: 290, stage1Torque: 410, stage2Power: 330, stage2Torque: 450 },
  { brand: "BMW", model: "4 Series", generation: "F32/F33/F36 (2013-2020)", engine: "3.0i", variant: "326hp", vehicleType: "car", originalPower: 326, originalTorque: 450, stage1Power: 380, stage1Torque: 520, stage2Power: 420, stage2Torque: 570 },
  { brand: "BMW", model: "4 Series", generation: "F32/F33/F36 (2013-2020)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  { brand: "BMW", model: "4 Series", generation: "F32/F33/F36 (2013-2020)", engine: "3.0d", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 560, stage1Power: 310, stage1Torque: 650, stage2Power: 350, stage2Torque: 720 },
  
  // BMW 5 Series Complete Range
  { brand: "BMW", model: "5 Series", generation: "E39 (1995-2003)", engine: "2.5d", variant: "163hp", vehicleType: "car", originalPower: 163, originalTorque: 350, stage1Power: 200, stage1Torque: 420, stage2Power: 230, stage2Torque: 460 },
  { brand: "BMW", model: "5 Series", generation: "E39 (1995-2003)", engine: "3.0d", variant: "184hp", vehicleType: "car", originalPower: 184, originalTorque: 390, stage1Power: 225, stage1Torque: 470, stage2Power: 255, stage2Torque: 510 },
  { brand: "BMW", model: "5 Series", generation: "E60/E61 (2003-2010)", engine: "2.0d", variant: "163hp", vehicleType: "car", originalPower: 163, originalTorque: 340, stage1Power: 200, stage1Torque: 410, stage2Power: 230, stage2Torque: 450 },
  { brand: "BMW", model: "5 Series", generation: "E60/E61 (2003-2010)", engine: "2.0d", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 350, stage1Power: 215, stage1Torque: 420, stage2Power: 245, stage2Torque: 460 },
  { brand: "BMW", model: "5 Series", generation: "E60/E61 (2003-2010)", engine: "3.0d", variant: "218hp", vehicleType: "car", originalPower: 218, originalTorque: 500, stage1Power: 260, stage1Torque: 590, stage2Power: 295, stage2Torque: 650 },
  { brand: "BMW", model: "5 Series", generation: "E60/E61 (2003-2010)", engine: "3.0d", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 520, stage1Power: 295, stage1Torque: 610, stage2Power: 335, stage2Torque: 670 },
  
  // BMW X Series SUVs
  { brand: "BMW", model: "X1", generation: "E84 (2009-2015)", engine: "2.0d", variant: "143hp", vehicleType: "car", originalPower: 143, originalTorque: 300, stage1Power: 180, stage1Torque: 360, stage2Power: 205, stage2Torque: 400 },
  { brand: "BMW", model: "X1", generation: "E84 (2009-2015)", engine: "2.0d", variant: "177hp", vehicleType: "car", originalPower: 177, originalTorque: 350, stage1Power: 215, stage1Torque: 420, stage2Power: 245, stage2Torque: 460 },
  { brand: "BMW", model: "X1", generation: "F48 (2015-2022)", engine: "1.5d", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 270, stage1Power: 145, stage1Torque: 320, stage2Power: 165, stage2Torque: 350 },
  { brand: "BMW", model: "X1", generation: "F48 (2015-2022)", engine: "2.0d", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 330, stage1Power: 185, stage1Torque: 390, stage2Power: 215, stage2Torque: 430 },
  { brand: "BMW", model: "X1", generation: "F48 (2015-2022)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // BMW X3 SUV
  { brand: "BMW", model: "X3", generation: "E83 (2003-2010)", engine: "2.0d", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 330, stage1Power: 185, stage1Torque: 390, stage2Power: 215, stage2Torque: 430 },
  { brand: "BMW", model: "X3", generation: "E83 (2003-2010)", engine: "3.0d", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 400, stage1Power: 245, stage1Torque: 480, stage2Power: 280, stage2Torque: 520 },
  { brand: "BMW", model: "X3", generation: "F25 (2010-2017)", engine: "2.0d", variant: "184hp", vehicleType: "car", originalPower: 184, originalTorque: 380, stage1Power: 225, stage1Torque: 450, stage2Power: 255, stage2Torque: 490 },
  { brand: "BMW", model: "X3", generation: "F25 (2010-2017)", engine: "3.0d", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 560, stage1Power: 310, stage1Torque: 650, stage2Power: 350, stage2Torque: 720 },
  { brand: "BMW", model: "X3", generation: "G01 (2017-2024)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  { brand: "BMW", model: "X3", generation: "G01 (2017-2024)", engine: "3.0d", variant: "265hp", vehicleType: "car", originalPower: 265, originalTorque: 620, stage1Power: 315, stage1Torque: 720, stage2Power: 355, stage2Torque: 780 },
  
  // BMW X5 SUV
  { brand: "BMW", model: "X5", generation: "E53 (1999-2006)", engine: "3.0d", variant: "184hp", vehicleType: "car", originalPower: 184, originalTorque: 390, stage1Power: 225, stage1Torque: 470, stage2Power: 255, stage2Torque: 510 },
  { brand: "BMW", model: "X5", generation: "E70 (2006-2013)", engine: "3.0d", variant: "235hp", vehicleType: "car", originalPower: 235, originalTorque: 520, stage1Power: 280, stage1Torque: 610, stage2Power: 320, stage2Torque: 670 },
  { brand: "BMW", model: "X5", generation: "E70 (2006-2013)", engine: "3.0d", variant: "245hp", vehicleType: "car", originalPower: 245, originalTorque: 540, stage1Power: 295, stage1Torque: 620, stage2Power: 335, stage2Torque: 680 },
  { brand: "BMW", model: "X5", generation: "F15 (2013-2018)", engine: "2.0d", variant: "231hp", vehicleType: "car", originalPower: 231, originalTorque: 450, stage1Power: 275, stage1Torque: 530, stage2Power: 315, stage2Torque: 580 },
  { brand: "BMW", model: "X5", generation: "F15 (2013-2018)", engine: "3.0d", variant: "258hp", vehicleType: "car", originalPower: 258, originalTorque: 560, stage1Power: 310, stage1Torque: 650, stage2Power: 350, stage2Torque: 720 },
  { brand: "BMW", model: "X5", generation: "G05 (2018-2024)", engine: "3.0d", variant: "265hp", vehicleType: "car", originalPower: 265, originalTorque: 620, stage1Power: 315, stage1Torque: 720, stage2Power: 355, stage2Torque: 780 },
  { brand: "BMW", model: "X5", generation: "G05 (2018-2024)", engine: "4.0d", variant: "400hp", vehicleType: "car", originalPower: 400, originalTorque: 760, stage1Power: 460, stage1Torque: 870, stage2Power: 510, stage2Torque: 950 },
  
  // === MERCEDES-BENZ COMPLETE LINEUP ===
  
  // A-Class Complete Range
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W168 (1997-2004)", engine: "1.7 CDI", variant: "90hp", vehicleType: "car", originalPower: 90, originalTorque: 180, stage1Power: 115, stage1Torque: 220, stage2Power: 135, stage2Torque: 250 },
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W169 (2004-2012)", engine: "2.0 CDI", variant: "109hp", vehicleType: "car", originalPower: 109, originalTorque: 250, stage1Power: 135, stage1Torque: 300, stage2Power: 155, stage2Torque: 330 },
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W169 (2004-2012)", engine: "2.0 CDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 300, stage1Power: 175, stage1Torque: 360, stage2Power: 200, stage2Torque: 400 },
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W176 (2012-2018)", engine: "1.5 CDI", variant: "109hp", vehicleType: "car", originalPower: 109, originalTorque: 260, stage1Power: 135, stage1Torque: 310, stage2Power: 155, stage2Torque: 340 },
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W176 (2012-2018)", engine: "2.0 CDI", variant: "136hp", vehicleType: "car", originalPower: 136, originalTorque: 300, stage1Power: 170, stage1Torque: 360, stage2Power: 195, stage2Torque: 400 },
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W177 (2018-2024)", engine: "1.5d", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 260, stage1Power: 145, stage1Torque: 310, stage2Power: 165, stage2Torque: 340 },
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W177 (2018-2024)", engine: "2.0d", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  { brand: "Mercedes-Benz", model: "A-Class", generation: "W177 (2018-2024)", engine: "2.0d", variant: "190hp", vehicleType: "car", originalPower: 190, originalTorque: 400, stage1Power: 235, stage1Torque: 470, stage2Power: 270, stage2Torque: 510 },
  
  // B-Class Range
  { brand: "Mercedes-Benz", model: "B-Class", generation: "W245 (2005-2011)", engine: "2.0 CDI", variant: "109hp", vehicleType: "car", originalPower: 109, originalTorque: 250, stage1Power: 135, stage1Torque: 300, stage2Power: 155, stage2Torque: 330 },
  { brand: "Mercedes-Benz", model: "B-Class", generation: "W245 (2005-2011)", engine: "2.0 CDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 300, stage1Power: 175, stage1Torque: 360, stage2Power: 200, stage2Torque: 400 },
  { brand: "Mercedes-Benz", model: "B-Class", generation: "W246 (2011-2018)", engine: "1.5 CDI", variant: "109hp", vehicleType: "car", originalPower: 109, originalTorque: 260, stage1Power: 135, stage1Torque: 310, stage2Power: 155, stage2Torque: 340 },
  { brand: "Mercedes-Benz", model: "B-Class", generation: "W246 (2011-2018)", engine: "2.0 CDI", variant: "136hp", vehicleType: "car", originalPower: 136, originalTorque: 300, stage1Power: 170, stage1Torque: 360, stage2Power: 195, stage2Torque: 400 },
  { brand: "Mercedes-Benz", model: "B-Class", generation: "W247 (2018-2024)", engine: "1.5d", variant: "116hp", vehicleType: "car", originalPower: 116, originalTorque: 260, stage1Power: 145, stage1Torque: 310, stage2Power: 165, stage2Torque: 340 },
  { brand: "Mercedes-Benz", model: "B-Class", generation: "W247 (2018-2024)", engine: "2.0d", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 190, stage1Torque: 380, stage2Power: 220, stage2Torque: 420 },
  
  // C-Class Complete Range
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W202 (1993-2000)", engine: "2.2 CDI", variant: "125hp", vehicleType: "car", originalPower: 125, originalTorque: 280, stage1Power: 155, stage1Torque: 340, stage2Power: 180, stage2Torque: 380 },
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W203 (2000-2007)", engine: "2.2 CDI", variant: "143hp", vehicleType: "car", originalPower: 143, originalTorque: 315, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W203 (2000-2007)", engine: "2.7 CDI", variant: "170hp", vehicleType: "car", originalPower: 170, originalTorque: 370, stage1Power: 210, stage1Torque: 440, stage2Power: 240, stage2Torque: 480 },
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W204 (2007-2014)", engine: "2.2 CDI", variant: "136hp", vehicleType: "car", originalPower: 136, originalTorque: 300, stage1Power: 170, stage1Torque: 360, stage2Power: 195, stage2Torque: 400 },
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W204 (2007-2014)", engine: "2.2 CDI", variant: "170hp", vehicleType: "car", originalPower: 170, originalTorque: 400, stage1Power: 210, stage1Torque: 470, stage2Power: 240, stage2Torque: 510 },
  { brand: "Mercedes-Benz", model: "C-Class", generation: "W204 (2007-2014)", engine: "3.0 CDI", variant: "204hp", vehicleType: "car", originalPower: 204, originalTorque: 500, stage1Power: 245, stage1Torque: 590, stage2Power: 280, stage2Torque: 650 },
  
  // === VOLKSWAGEN COMPLETE LINEUP ===
  
  // Polo Range
  { brand: "Volkswagen", model: "Polo", generation: "9N (2001-2009)", engine: "1.4 TDI", variant: "70hp", vehicleType: "car", originalPower: 70, originalTorque: 155, stage1Power: 90, stage1Torque: 190, stage2Power: 105, stage2Torque: 215 },
  { brand: "Volkswagen", model: "Polo", generation: "9N (2001-2009)", engine: "1.4 TDI", variant: "80hp", vehicleType: "car", originalPower: 80, originalTorque: 195, stage1Power: 105, stage1Torque: 240, stage2Power: 120, stage2Torque: 270 },
  { brand: "Volkswagen", model: "Polo", generation: "9N (2001-2009)", engine: "1.9 TDI", variant: "100hp", vehicleType: "car", originalPower: 100, originalTorque: 240, stage1Power: 130, stage1Torque: 290, stage2Power: 150, stage2Torque: 320 },
  { brand: "Volkswagen", model: "Polo", generation: "6R (2009-2017)", engine: "1.2 TDI", variant: "75hp", vehicleType: "car", originalPower: 75, originalTorque: 180, stage1Power: 95, stage1Torque: 220, stage2Power: 110, stage2Torque: 250 },
  { brand: "Volkswagen", model: "Polo", generation: "6R (2009-2017)", engine: "1.6 TDI", variant: "90hp", vehicleType: "car", originalPower: 90, originalTorque: 230, stage1Power: 115, stage1Torque: 280, stage2Power: 135, stage2Torque: 310 },
  { brand: "Volkswagen", model: "Polo", generation: "6R (2009-2017)", engine: "1.6 TDI", variant: "105hp", vehicleType: "car", originalPower: 105, originalTorque: 250, stage1Power: 135, stage1Torque: 300, stage2Power: 155, stage2Torque: 330 },
  { brand: "Volkswagen", model: "Polo", generation: "AW (2017-2024)", engine: "1.0 TDI", variant: "80hp", vehicleType: "car", originalPower: 80, originalTorque: 200, stage1Power: 105, stage1Torque: 245, stage2Power: 120, stage2Torque: 275 },
  { brand: "Volkswagen", model: "Polo", generation: "AW (2017-2024)", engine: "1.6 TDI", variant: "95hp", vehicleType: "car", originalPower: 95, originalTorque: 250, stage1Power: 120, stage1Torque: 300, stage2Power: 140, stage2Torque: 330 },
  
  // Golf Complete Evolution
  { brand: "Volkswagen", model: "Golf", generation: "MK4 (1997-2006)", engine: "1.9 TDI", variant: "90hp", vehicleType: "car", originalPower: 90, originalTorque: 210, stage1Power: 115, stage1Torque: 260, stage2Power: 135, stage2Torque: 290 },
  { brand: "Volkswagen", model: "Golf", generation: "MK4 (1997-2006)", engine: "1.9 TDI", variant: "110hp", vehicleType: "car", originalPower: 110, originalTorque: 235, stage1Power: 140, stage1Torque: 285, stage2Power: 160, stage2Torque: 315 },
  { brand: "Volkswagen", model: "Golf", generation: "MK4 (1997-2006)", engine: "1.9 TDI", variant: "115hp", vehicleType: "car", originalPower: 115, originalTorque: 285, stage1Power: 145, stage1Torque: 340, stage2Power: 165, stage2Torque: 375 },
  { brand: "Volkswagen", model: "Golf", generation: "MK4 (1997-2006)", engine: "1.9 TDI", variant: "130hp", vehicleType: "car", originalPower: 130, originalTorque: 310, stage1Power: 160, stage1Torque: 370, stage2Power: 185, stage2Torque: 410 },
  { brand: "Volkswagen", model: "Golf", generation: "MK4 (1997-2006)", engine: "1.9 TDI", variant: "150hp", vehicleType: "car", originalPower: 150, originalTorque: 320, stage1Power: 185, stage1Torque: 380, stage2Power: 210, stage2Torque: 420 },
  { brand: "Volkswagen", model: "Golf", generation: "MK5 (2003-2009)", engine: "1.9 TDI", variant: "105hp", vehicleType: "car", originalPower: 105, originalTorque: 250, stage1Power: 135, stage1Torque: 300, stage2Power: 155, stage2Torque: 330 },
  { brand: "Volkswagen", model: "Golf", generation: "MK5 (2003-2009)", engine: "2.0 TDI", variant: "140hp", vehicleType: "car", originalPower: 140, originalTorque: 320, stage1Power: 175, stage1Torque: 380, stage2Power: 200, stage2Torque: 420 },
  { brand: "Volkswagen", model: "Golf", generation: "MK5 (2003-2009)", engine: "2.0 TDI", variant: "170hp", vehicleType: "car", originalPower: 170, originalTorque: 350, stage1Power: 210, stage1Torque: 420, stage2Power: 240, stage2Torque: 460 },
  
  // Comprehensive FORD Range
  { brand: "Ford", model: "Fiesta", generation: "MK6 (2008-2017)", engine: "1.4 TDCi", variant: "68hp", vehicleType: "car", originalPower: 68, originalTorque: 160, stage1Power: 90, stage1Torque: 195, stage2Power: 105, stage2Torque: 220 },
  { brand: "Ford", model: "Fiesta", generation: "MK6 (2008-2017)", engine: "1.6 TDCi", variant: "95hp", vehicleType: "car", originalPower: 95, originalTorque: 240, stage1Power: 120, stage1Torque: 290, stage2Power: 140, stage2Torque: 320 },
  { brand: "Ford", model: "Fiesta", generation: "MK7 (2017-2023)", engine: "1.5 TDCi", variant: "85hp", vehicleType: "car", originalPower: 85, originalTorque: 210, stage1Power: 110, stage1Torque: 255, stage2Power: 130, stage2Torque: 285 },
  { brand: "Ford", model: "Fiesta", generation: "MK7 (2017-2023)", engine: "1.5 TDCi", variant: "120hp", vehicleType: "car", originalPower: 120, originalTorque: 270, stage1Power: 150, stage1Torque: 325, stage2Power: 175, stage2Torque: 360 },
  
  // Focus Complete Range
  { brand: "Ford", model: "Focus", generation: "MK1 (1998-2007)", engine: "1.8 TDCi", variant: "115hp", vehicleType: "car", originalPower: 115, originalTorque: 280, stage1Power: 145, stage1Torque: 340, stage2Power: 165, stage2Torque: 375 },
  { brand: "Ford", model: "Focus", generation: "MK2 (2004-2011)", engine: "1.6 TDCi", variant: "90hp", vehicleType: "car", originalPower: 90, originalTorque: 240, stage1Power: 115, stage1Torque: 290, stage2Power: 135, stage2Torque: 320 },
  { brand: "Ford", model: "Focus", generation: "MK2 (2004-2011)", engine: "1.6 TDCi", variant: "109hp", vehicleType: "car", originalPower: 109, originalTorque: 240, stage1Power: 135, stage1Torque: 290, stage2Power: 155, stage2Torque: 320 },
  { brand: "Ford", model: "Focus", generation: "MK2 (2004-2011)", engine: "1.8 TDCi", variant: "115hp", vehicleType: "car", originalPower: 115, originalTorque: 280, stage1Power: 145, stage1Torque: 340, stage2Power: 165, stage2Torque: 375 },
  { brand: "Ford", model: "Focus", generation: "MK2 (2004-2011)", engine: "2.0 TDCi", variant: "136hp", vehicleType: "car", originalPower: 136, originalTorque: 320, stage1Power: 170, stage1Torque: 380, stage2Power: 195, stage2Torque: 420 },
  
  // === MASSIVE TRUCK COVERAGE ===
  
  // Mercedes-Benz Trucks Complete Range
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP2 (2003-2011)", engine: "11.9L OM501", variant: "428hp", vehicleType: "truck", originalPower: 428, originalTorque: 2100, stage1Power: 500, stage1Torque: 2400, stage2Power: 560, stage2Torque: 2600 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP2 (2003-2011)", engine: "11.9L OM501", variant: "476hp", vehicleType: "truck", originalPower: 476, originalTorque: 2300, stage1Power: 550, stage1Torque: 2600, stage2Power: 610, stage2Torque: 2800 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP3 (2008-2011)", engine: "11.9L OM501", variant: "408hp", vehicleType: "truck", originalPower: 408, originalTorque: 2000, stage1Power: 480, stage1Torque: 2300, stage2Power: 540, stage2Torque: 2500 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP3 (2008-2011)", engine: "11.9L OM501", variant: "449hp", vehicleType: "truck", originalPower: 449, originalTorque: 2200, stage1Power: 520, stage1Torque: 2500, stage2Power: 580, stage2Torque: 2700 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP3 (2008-2011)", engine: "11.9L OM501", variant: "476hp", vehicleType: "truck", originalPower: 476, originalTorque: 2300, stage1Power: 550, stage1Torque: 2600, stage2Power: 610, stage2Torque: 2800 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "10.7L OM470", variant: "394hp", vehicleType: "truck", originalPower: 394, originalTorque: 1900, stage1Power: 460, stage1Torque: 2200, stage2Power: 520, stage2Torque: 2400 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "10.7L OM470", variant: "421hp", vehicleType: "truck", originalPower: 421, originalTorque: 2000, stage1Power: 490, stage1Torque: 2300, stage2Power: 550, stage2Torque: 2500 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "12.8L OM471", variant: "449hp", vehicleType: "truck", originalPower: 449, originalTorque: 2200, stage1Power: 520, stage1Torque: 2500, stage2Power: 580, stage2Torque: 2700 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "12.8L OM471", variant: "476hp", vehicleType: "truck", originalPower: 476, originalTorque: 2300, stage1Power: 550, stage1Torque: 2600, stage2Power: 610, stage2Torque: 2800 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "15.6L OM473", variant: "510hp", vehicleType: "truck", originalPower: 510, originalTorque: 2500, stage1Power: 590, stage1Torque: 2850, stage2Power: 650, stage2Torque: 3050 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "15.6L OM473", variant: "530hp", vehicleType: "truck", originalPower: 530, originalTorque: 2600, stage1Power: 610, stage1Torque: 2950, stage2Power: 680, stage2Torque: 3200 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP4 (2011-2018)", engine: "15.6L OM473", variant: "598hp", vehicleType: "truck", originalPower: 598, originalTorque: 2800, stage1Power: 680, stage1Torque: 3200, stage2Power: 750, stage2Torque: 3450 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP5 (2018-2024)", engine: "10.7L OM470", variant: "394hp", vehicleType: "truck", originalPower: 394, originalTorque: 1900, stage1Power: 460, stage1Torque: 2200, stage2Power: 520, stage2Torque: 2400 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP5 (2018-2024)", engine: "12.8L OM471", variant: "449hp", vehicleType: "truck", originalPower: 449, originalTorque: 2200, stage1Power: 520, stage1Torque: 2500, stage2Power: 580, stage2Torque: 2700 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP5 (2018-2024)", engine: "15.6L OM473", variant: "530hp", vehicleType: "truck", originalPower: 530, originalTorque: 2600, stage1Power: 610, stage1Torque: 2950, stage2Power: 680, stage2Torque: 3200 },
  { brand: "Mercedes-Benz", model: "Actros", generation: "MP5 (2018-2024)", engine: "15.6L OM473", variant: "625hp", vehicleType: "truck", originalPower: 625, originalTorque: 3000, stage1Power: 710, stage1Torque: 3400, stage2Power: 780, stage2Torque: 3700 },

  // Mercedes-Benz Antos Range
  { brand: "Mercedes-Benz", model: "Antos", generation: "(2012-2024)", engine: "7.7L OM936", variant: "238hp", vehicleType: "truck", originalPower: 238, originalTorque: 1000, stage1Power: 280, stage1Torque: 1150, stage2Power: 315, stage2Torque: 1250 },
  { brand: "Mercedes-Benz", model: "Antos", generation: "(2012-2024)", engine: "7.7L OM936", variant: "279hp", vehicleType: "truck", originalPower: 279, originalTorque: 1100, stage1Power: 325, stage1Torque: 1300, stage2Power: 365, stage2Torque: 1400 },
  { brand: "Mercedes-Benz", model: "Antos", generation: "(2012-2024)", engine: "7.7L OM936", variant: "320hp", vehicleType: "truck", originalPower: 320, originalTorque: 1300, stage1Power: 375, stage1Torque: 1500, stage2Power: 420, stage2Torque: 1650 },
  { brand: "Mercedes-Benz", model: "Antos", generation: "(2012-2024)", engine: "10.7L OM470", variant: "394hp", vehicleType: "truck", originalPower: 394, originalTorque: 1900, stage1Power: 460, stage1Torque: 2200, stage2Power: 520, stage2Torque: 2400 },
  
  // Mercedes-Benz Atego Range
  { brand: "Mercedes-Benz", model: "Atego", generation: "I (1998-2004)", engine: "4.3L OM904", variant: "156hp", vehicleType: "truck", originalPower: 156, originalTorque: 650, stage1Power: 185, stage1Torque: 750, stage2Power: 210, stage2Torque: 820 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "I (1998-2004)", engine: "6.4L OM906", variant: "231hp", vehicleType: "truck", originalPower: 231, originalTorque: 900, stage1Power: 270, stage1Torque: 1050, stage2Power: 305, stage2Torque: 1150 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "II (2004-2013)", engine: "4.3L OM904", variant: "156hp", vehicleType: "truck", originalPower: 156, originalTorque: 650, stage1Power: 185, stage1Torque: 750, stage2Power: 210, stage2Torque: 820 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "II (2004-2013)", engine: "4.3L OM904", variant: "177hp", vehicleType: "truck", originalPower: 177, originalTorque: 700, stage1Power: 210, stage1Torque: 810, stage2Power: 240, stage2Torque: 890 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "II (2004-2013)", engine: "6.4L OM906", variant: "231hp", vehicleType: "truck", originalPower: 231, originalTorque: 900, stage1Power: 270, stage1Torque: 1050, stage2Power: 305, stage2Torque: 1150 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "II (2004-2013)", engine: "6.4L OM906", variant: "265hp", vehicleType: "truck", originalPower: 265, originalTorque: 1000, stage1Power: 310, stage1Torque: 1150, stage2Power: 350, stage2Torque: 1250 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "III (2013-2024)", engine: "5.1L OM934", variant: "156hp", vehicleType: "truck", originalPower: 156, originalTorque: 650, stage1Power: 185, stage1Torque: 750, stage2Power: 210, stage2Torque: 820 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "III (2013-2024)", engine: "5.1L OM934", variant: "204hp", vehicleType: "truck", originalPower: 204, originalTorque: 800, stage1Power: 240, stage1Torque: 920, stage2Power: 270, stage2Torque: 1000 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "III (2013-2024)", engine: "7.7L OM936", variant: "238hp", vehicleType: "truck", originalPower: 238, originalTorque: 1000, stage1Power: 280, stage1Torque: 1150, stage2Power: 315, stage2Torque: 1250 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "III (2013-2024)", engine: "7.7L OM936", variant: "279hp", vehicleType: "truck", originalPower: 279, originalTorque: 1100, stage1Power: 325, stage1Torque: 1300, stage2Power: 365, stage2Torque: 1400 },
  { brand: "Mercedes-Benz", model: "Atego", generation: "III (2013-2024)", engine: "7.7L OM936", variant: "292hp", vehicleType: "truck", originalPower: 292, originalTorque: 1200, stage1Power: 340, stage1Torque: 1400, stage2Power: 380, stage2Torque: 1500 },

  // === COMPREHENSIVE TRACTOR COVERAGE ===
  
  // John Deere Complete Range
  { brand: "John Deere", model: "5R Series", generation: "5090R (2017-2024)", engine: "4.5L PowerTech", variant: "90hp", vehicleType: "tractor", originalPower: 90, originalTorque: 380, stage1Power: 110, stage1Torque: 440, stage2Power: 125, stage2Torque: 480 },
  { brand: "John Deere", model: "5R Series", generation: "5100R (2017-2024)", engine: "4.5L PowerTech", variant: "100hp", vehicleType: "tractor", originalPower: 100, originalTorque: 420, stage1Power: 120, stage1Torque: 480, stage2Power: 135, stage2Torque: 520 },
  { brand: "John Deere", model: "5R Series", generation: "5115R (2017-2024)", engine: "4.5L PowerTech", variant: "115hp", vehicleType: "tractor", originalPower: 115, originalTorque: 480, stage1Power: 140, stage1Torque: 550, stage2Power: 160, stage2Torque: 600 },
  { brand: "John Deere", model: "5R Series", generation: "5125R (2017-2024)", engine: "4.5L PowerTech", variant: "125hp", vehicleType: "tractor", originalPower: 125, originalTorque: 520, stage1Power: 150, stage1Torque: 600, stage2Power: 170, stage2Torque: 650 },

  { brand: "John Deere", model: "6M Series", generation: "6110M (2017-2024)", engine: "4.5L PowerTech", variant: "110hp", vehicleType: "tractor", originalPower: 110, originalTorque: 460, stage1Power: 135, stage1Torque: 530, stage2Power: 155, stage2Torque: 580 },
  { brand: "John Deere", model: "6M Series", generation: "6120M (2017-2024)", engine: "4.5L PowerTech", variant: "120hp", vehicleType: "tractor", originalPower: 120, originalTorque: 500, stage1Power: 145, stage1Torque: 580, stage2Power: 165, stage2Torque: 630 },
  { brand: "John Deere", model: "6M Series", generation: "6130M (2017-2024)", engine: "4.5L PowerTech", variant: "130hp", vehicleType: "tractor", originalPower: 130, originalTorque: 540, stage1Power: 155, stage1Torque: 620, stage2Power: 175, stage2Torque: 680 },
  { brand: "John Deere", model: "6M Series", generation: "6140M (2017-2024)", engine: "6.8L PowerTech", variant: "140hp", vehicleType: "tractor", originalPower: 140, originalTorque: 580, stage1Power: 170, stage1Torque: 670, stage2Power: 190, stage2Torque: 730 },

  { brand: "John Deere", model: "6R Series", generation: "6110R (2017-2024)", engine: "6.8L PowerTech", variant: "110hp", vehicleType: "tractor", originalPower: 110, originalTorque: 480, stage1Power: 135, stage1Torque: 550, stage2Power: 155, stage2Torque: 600 },
  { brand: "John Deere", model: "6R Series", generation: "6120R (2017-2024)", engine: "6.8L PowerTech", variant: "120hp", vehicleType: "tractor", originalPower: 120, originalTorque: 520, stage1Power: 145, stage1Torque: 600, stage2Power: 165, stage2Torque: 650 },
  { brand: "John Deere", model: "6R Series", generation: "6130R (2017-2024)", engine: "6.8L PowerTech", variant: "130hp", vehicleType: "tractor", originalPower: 130, originalTorque: 560, stage1Power: 155, stage1Torque: 640, stage2Power: 175, stage2Torque: 700 },
  { brand: "John Deere", model: "6R Series", generation: "6140R (2017-2024)", engine: "6.8L PowerTech", variant: "140hp", vehicleType: "tractor", originalPower: 140, originalTorque: 600, stage1Power: 170, stage1Torque: 690, stage2Power: 190, stage2Torque: 750 },
  { brand: "John Deere", model: "6R Series", generation: "6150R (2017-2024)", engine: "6.8L PowerTech", variant: "150hp", vehicleType: "tractor", originalPower: 150, originalTorque: 650, stage1Power: 180, stage1Torque: 750, stage2Power: 200, stage2Torque: 820 },
  { brand: "John Deere", model: "6R Series", generation: "6170R (2017-2024)", engine: "6.8L PowerTech", variant: "170hp", vehicleType: "tractor", originalPower: 170, originalTorque: 720, stage1Power: 205, stage1Torque: 830, stage2Power: 230, stage2Torque: 900 },
  { brand: "John Deere", model: "6R Series", generation: "6190R (2017-2024)", engine: "6.8L PowerTech", variant: "190hp", vehicleType: "tractor", originalPower: 190, originalTorque: 800, stage1Power: 230, stage1Torque: 920, stage2Power: 260, stage2Torque: 1000 },
  { brand: "John Deere", model: "6R Series", generation: "6210R (2017-2024)", engine: "6.8L PowerTech", variant: "210hp", vehicleType: "tractor", originalPower: 210, originalTorque: 880, stage1Power: 250, stage1Torque: 1000, stage2Power: 280, stage2Torque: 1100 },
  { brand: "John Deere", model: "6R Series", generation: "6230R (2017-2024)", engine: "6.8L PowerTech", variant: "230hp", vehicleType: "tractor", originalPower: 230, originalTorque: 960, stage1Power: 275, stage1Torque: 1100, stage2Power: 310, stage2Torque: 1200 },
  { brand: "John Deere", model: "6R Series", generation: "6250R (2017-2024)", engine: "6.8L PowerTech", variant: "250hp", vehicleType: "tractor", originalPower: 250, originalTorque: 1050, stage1Power: 300, stage1Torque: 1200, stage2Power: 340, stage2Torque: 1300 },

  { brand: "John Deere", model: "7R Series", generation: "7210R (2017-2024)", engine: "9.0L PowerTech", variant: "210hp", vehicleType: "tractor", originalPower: 210, originalTorque: 900, stage1Power: 250, stage1Torque: 1050, stage2Power: 280, stage2Torque: 1150 },
  { brand: "John Deere", model: "7R Series", generation: "7230R (2017-2024)", engine: "9.0L PowerTech", variant: "230hp", vehicleType: "tractor", originalPower: 230, originalTorque: 1000, stage1Power: 270, stage1Torque: 1150, stage2Power: 300, stage2Torque: 1250 },
  { brand: "John Deere", model: "7R Series", generation: "7250R (2017-2024)", engine: "9.0L PowerTech", variant: "250hp", vehicleType: "tractor", originalPower: 250, originalTorque: 1100, stage1Power: 295, stage1Torque: 1250, stage2Power: 330, stage2Torque: 1350 },
  { brand: "John Deere", model: "7R Series", generation: "7270R (2017-2024)", engine: "9.0L PowerTech", variant: "270hp", vehicleType: "tractor", originalPower: 270, originalTorque: 1200, stage1Power: 320, stage1Torque: 1400, stage2Power: 360, stage2Torque: 1550 },
  { brand: "John Deere", model: "7R Series", generation: "7290R (2017-2024)", engine: "9.0L PowerTech", variant: "290hp", vehicleType: "tractor", originalPower: 290, originalTorque: 1300, stage1Power: 345, stage1Torque: 1500, stage2Power: 385, stage2Torque: 1650 },
  { brand: "John Deere", model: "7R Series", generation: "7310R (2017-2024)", engine: "9.0L PowerTech", variant: "310hp", vehicleType: "tractor", originalPower: 310, originalTorque: 1400, stage1Power: 370, stage1Torque: 1600, stage2Power: 415, stage2Torque: 1750 },

  { brand: "John Deere", model: "8R Series", generation: "8245R (2017-2024)", engine: "13.5L PowerTech", variant: "245hp", vehicleType: "tractor", originalPower: 245, originalTorque: 1100, stage1Power: 290, stage1Torque: 1250, stage2Power: 325, stage2Torque: 1350 },
  { brand: "John Deere", model: "8R Series", generation: "8270R (2017-2024)", engine: "13.5L PowerTech", variant: "270hp", vehicleType: "tractor", originalPower: 270, originalTorque: 1200, stage1Power: 320, stage1Torque: 1400, stage2Power: 360, stage2Torque: 1550 },
  { brand: "John Deere", model: "8R Series", generation: "8295R (2017-2024)", engine: "13.5L PowerTech", variant: "295hp", vehicleType: "tractor", originalPower: 295, originalTorque: 1350, stage1Power: 350, stage1Torque: 1550, stage2Power: 395, stage2Torque: 1700 },
  { brand: "John Deere", model: "8R Series", generation: "8320R (2017-2024)", engine: "13.5L PowerTech", variant: "320hp", vehicleType: "tractor", originalPower: 320, originalTorque: 1450, stage1Power: 380, stage1Torque: 1650, stage2Power: 425, stage2Torque: 1800 },
  { brand: "John Deere", model: "8R Series", generation: "8345R (2017-2024)", engine: "13.5L PowerTech", variant: "345hp", vehicleType: "tractor", originalPower: 345, originalTorque: 1550, stage1Power: 410, stage1Torque: 1750, stage2Power: 460, stage2Torque: 1900 },
  { brand: "John Deere", model: "8R Series", generation: "8370R (2017-2024)", engine: "13.5L PowerTech", variant: "370hp", vehicleType: "tractor", originalPower: 370, originalTorque: 1600, stage1Power: 430, stage1Torque: 1850, stage2Power: 480, stage2Torque: 2000 },
  { brand: "John Deere", model: "8R Series", generation: "8400R (2017-2024)", engine: "13.5L PowerTech", variant: "400hp", vehicleType: "tractor", originalPower: 400, originalTorque: 1750, stage1Power: 470, stage1Torque: 2000, stage2Power: 530, stage2Torque: 2200 },

  { brand: "John Deere", model: "9R Series", generation: "9470R (2017-2024)", engine: "13.5L PowerTech", variant: "470hp", vehicleType: "tractor", originalPower: 470, originalTorque: 2100, stage1Power: 550, stage1Torque: 2400, stage2Power: 620, stage2Torque: 2650 },
  { brand: "John Deere", model: "9R Series", generation: "9520R (2017-2024)", engine: "13.5L PowerTech", variant: "520hp", vehicleType: "tractor", originalPower: 520, originalTorque: 2300, stage1Power: 610, stage1Torque: 2650, stage2Power: 690, stage2Torque: 2900 },
  { brand: "John Deere", model: "9R Series", generation: "9570R (2017-2024)", engine: "13.5L PowerTech", variant: "570hp", vehicleType: "tractor", originalPower: 570, originalTorque: 2500, stage1Power: 670, stage1Torque: 2850, stage2Power: 750, stage2Torque: 3100 },
  { brand: "John Deere", model: "9R Series", generation: "9620R (2017-2024)", engine: "13.5L PowerTech", variant: "620hp", vehicleType: "tractor", originalPower: 620, originalTorque: 2700, stage1Power: 730, stage1Torque: 3100, stage2Power: 820, stage2Torque: 3400 }
];