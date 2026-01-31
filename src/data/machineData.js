export const generateMachineData = (count = 70) => {
  const types = ['M', 'L', 'H'];
  const data = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const productName = `${type}${14860 + i}`;
    
    data.push({
      id: i + 1,
      productName,
      type,
      airTemp: `${(298 + Math.random() * 0.5).toFixed(1)} K`,
      processTemp: `${(308 + Math.random() * 0.5).toFixed(1)} K`,
      rotationalSpeed: `${Math.floor(1400 + Math.random() * 200)} rpm`,
      torque: `${(40 + Math.random() * 10).toFixed(1)} Nm`,
      toolWear: `${Math.floor(Math.random() * 10)} Min`,
    });
  }

  return data;
};

export const machineData = generateMachineData(70);

// Temp
export const sampleMachines = [
  {
    id: 1,
    machine_id: 'M_H_01',
    air_temperature: 304.1,
    process_temperature: 308.6,
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 0,
    type: 'M',
    description: 'Normal Operation - Healthy Machine'
  },
  {
    id: 2,
    machine_id: 'M_L_15',
    air_temperature: 302.5,
    process_temperature: 312.8,
    rotational_speed: 1400,
    torque: 55.2,
    tool_wear: 150,
    type: 'L',
    description: 'Medium Wear - Warning Signs'
  },
  {
    id: 3,
    machine_id: 'M_H_23',
    air_temperature: 305.0,
    process_temperature: 318.5,
    rotational_speed: 1200,
    torque: 68.5,
    tool_wear: 220,
    type: 'H',
    description: 'High Stress - Critical Condition'
  },
  {
    id: 4,
    machine_id: 'M_M_08',
    air_temperature: 296.8,
    process_temperature: 307.2,
    rotational_speed: 1650,
    torque: 38.4,
    tool_wear: 45,
    type: 'M',
    description: 'Optimal Parameters - Good Health'
  },
  {
    id: 5,
    machine_id: 'M_L_32',
    air_temperature: 308.2,
    process_temperature: 322.0,
    rotational_speed: 1100,
    torque: 72.3,
    tool_wear: 280,
    type: 'L',
    description: 'Extreme Conditions - Immediate Attention Required'
  },
  {
    id: 6,
    machine_id: 'M_H_09',
    air_temperature: 304.1,
    process_temperature: 308.6,
    rotational_speed: 1551,
    torque: 42.8,
    tool_wear: 0,
    type: 'M',
    description: 'Normal Operation - Healthy Machine'
  },
  {
    id: 7,
    machine_id: 'M_L_19',
    air_temperature: 302.5,
    process_temperature: 312.8,
    rotational_speed: 1400,
    torque: 55.2,
    tool_wear: 150,
    type: 'L',
    description: 'Medium Wear - Warning Signs'
  },
  {
    id: 8,
    machine_id: 'M_H_29',
    air_temperature: 305.0,
    process_temperature: 318.5,
    rotational_speed: 1200,
    torque: 68.5,
    tool_wear: 220,
    type: 'H',
    description: 'High Stress - Critical Condition'
  },
  {
    id: 9,
    machine_id: 'M_M_09',
    air_temperature: 296.8,
    process_temperature: 307.2,
    rotational_speed: 1650,
    torque: 38.4,
    tool_wear: 45,
    type: 'M',
    description: 'Optimal Parameters - Good Health'
  },
  {
    id: 10,
    machine_id: 'M_L_39',
    air_temperature: 308.2,
    process_temperature: 322.0,
    rotational_speed: 1100,
    torque: 72.3,
    tool_wear: 280,
    type: 'L',
    description: 'Extreme Conditions - Immediate Attention Required'
  },
  {
    id: 11,
    machine_id: 'M_H_11',
    air_temperature: 303.7,
    process_temperature: 309.1,
    rotational_speed: 1500,
    torque: 44.1,
    tool_wear: 10,
    type: 'M',
    description: 'Slight Variation - Monitoring Recommended'
  },
  {
    id: 12,
    machine_id: 'M_L_21',
    air_temperature: 301.9,
    process_temperature: 313.5,
    rotational_speed: 1425,
    torque: 58.6,
    tool_wear: 130,
    type: 'L',
    description: 'Moderate Wear - Schedule Maintenance'
  },
  {
    id: 13,
    machine_id: 'M_H_33',
    air_temperature: 306.4,
    process_temperature: 320.2,
    rotational_speed: 1180,
    torque: 70.0,
    tool_wear: 240,
    type: 'H',
    description: 'High Load - Inspect Immediately'
  },
  {
    id: 14,
    machine_id: 'M_M_12',
    air_temperature: 297.5,
    process_temperature: 306.9,
    rotational_speed: 1620,
    torque: 39.7,
    tool_wear: 30,
    type: 'M',
    description: 'Stable - Within Optimal Range'
  },
  {
    id: 15,
    machine_id: 'M_L_27',
    air_temperature: 309.0,
    process_temperature: 323.1,
    rotational_speed: 1120,
    torque: 73.5,
    tool_wear: 295,
    type: 'L',
    description: 'Severe Wear - Replace Tooling'
  },
  {
    id: 16,
    machine_id: 'M_H_14',
    air_temperature: 304.9,
    process_temperature: 310.0,
    rotational_speed: 1540,
    torque: 46.2,
    tool_wear: 5,
    type: 'M',
    description: 'Normal Operation - Healthy Machine'
  },
  {
    id: 17,
    machine_id: 'M_L_07',
    air_temperature: 303.0,
    process_temperature: 315.4,
    rotational_speed: 1390,
    torque: 54.0,
    tool_wear: 165,
    type: 'L',
    description: 'Wearing - Keep Under Review'
  },
  {
    id: 18,
    machine_id: 'M_H_18',
    air_temperature: 305.6,
    process_temperature: 319.0,
    rotational_speed: 1220,
    torque: 66.8,
    tool_wear: 205,
    type: 'H',
    description: 'High Stress - Possible Failure'
  },
  {
    id: 19,
    machine_id: 'M_M_16',
    air_temperature: 295.9,
    process_temperature: 306.0,
    rotational_speed: 1670,
    torque: 37.9,
    tool_wear: 20,
    type: 'M',
    description: 'Good Condition - Minor Drift'
  },
  {
    id: 20,
    machine_id: 'M_L_44',
    air_temperature: 307.8,
    process_temperature: 321.5,
    rotational_speed: 1085,
    torque: 71.1,
    tool_wear: 260,
    type: 'L',
    description: 'High Wear - Maintenance Due'
  },
  {
    id: 21,
    machine_id: 'M_H_20',
    air_temperature: 304.3,
    process_temperature: 311.2,
    rotational_speed: 1490,
    torque: 45.6,
    tool_wear: 2,
    type: 'M',
    description: 'Normal Operation - Healthy Machine'
  },
  {
    id: 22,
    machine_id: 'M_L_02',
    air_temperature: 302.0,
    process_temperature: 314.0,
    rotational_speed: 1410,
    torque: 56.8,
    tool_wear: 140,
    type: 'L',
    description: 'Moderate Wear - Check Soon'
  },
  {
    id: 23,
    machine_id: 'M_H_25',
    air_temperature: 305.8,
    process_temperature: 317.7,
    rotational_speed: 1210,
    torque: 69.2,
    tool_wear: 230,
    type: 'H',
    description: 'Critical Load - Action Required'
  },
  {
    id: 24,
    machine_id: 'M_M_21',
    air_temperature: 296.2,
    process_temperature: 307.5,
    rotational_speed: 1635,
    torque: 38.9,
    tool_wear: 40,
    type: 'M',
    description: 'Optimal - Continue Monitoring'
  },
  {
    id: 25,
    machine_id: 'M_L_35',
    air_temperature: 308.7,
    process_temperature: 324.2,
    rotational_speed: 1095,
    torque: 74.0,
    tool_wear: 300,
    type: 'L',
    description: 'Severe - Immediate Service Needed'
  }
];