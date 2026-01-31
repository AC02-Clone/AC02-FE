export const validateSensorData = (data) => {
  const errors = [];

  if (!data. machine_id) errors.push('Machine ID is required');
  if (typeof data.air_temperature !== 'number') errors.push('Air temperature must be a number');
  if (typeof data.process_temperature !== 'number') errors.push('Process temperature must be a number');
  if (typeof data.rotational_speed !== 'number') errors.push('Rotational speed must be a number');
  if (typeof data.torque !== 'number') errors. push('Torque must be a number');
  if (typeof data.tool_wear !== 'number') errors.push('Tool wear must be a number');
  if (! ['L', 'M', 'H'].includes(data.type)) errors.push('Type must be L, M, or H');

  // Range validation
  if (data.air_temperature < 270 || data.air_temperature > 320) {
    errors.push('Air temperature should be between 270-320 K');
  }
  if (data.process_temperature < 290 || data.process_temperature > 320) {
    errors.push('Process temperature should be between 290-320 K');
  }
  if (data.rotational_speed < 1000 || data.rotational_speed > 2500) {
    errors.push('Rotational speed should be between 1000-2500 RPM');
  }
  if (data.torque < 10 || data.torque > 80) {
    errors.push('Torque should be between 10-80 Nm');
  }
  if (data.tool_wear < 0 || data.tool_wear > 300) {
    errors.push('Tool wear should be between 0-300 min');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format input untuk API
export const formatPredictionInput = (data) => {
  return {
    machine_id: data.machine_id?. trim() || '',
    air_temperature: parseFloat(data.air_temperature),
    process_temperature: parseFloat(data.process_temperature),
    rotational_speed: parseFloat(data.rotational_speed),
    torque: parseFloat(data.torque),
    tool_wear: parseFloat(data. tool_wear),
    type: data.type?. toUpperCase() || ''
  };
};

// Parse response dari API
export const formatPredictionResponse = (response) => {
  return {
    ... response,
    confidence: parseFloat(response.confidence),
    timestamp: new Date(response.timestamp). toLocaleString()
  };
};

// Parse CSV data
export const parseCSVData = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.toLowerCase().trim());
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const row = {};
    
    headers. forEach((header, i) => {
      row[header] = values[i]?.trim() || '';
    });
    
    return row;
  });
};

// Generate CSV dari results
export const generateCSVDownload = (results) => {
  if (!results || ! results.results || results.results.length === 0) {
    return null;
  }

  const headers = [
    'Row Number',
    'Machine ID',
    'Prediction',
    'Confidence',
    'Primary Cause',
    'Severity',
    'Sensor Alert',
    'Recommended Action',
    'Overall Health'
  ];

  const rows = results.results.map(result => [
    result.row_number,
    result.machine_id,
    result.prediction,
    (result.confidence * 100).toFixed(2) + '%',
    result.diagnostics.primary_cause,
    result.diagnostics.severity,
    result.diagnostics.sensor_alert,
    result.diagnostics.recommended_action,
    result.overall_health
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document. createElement('a');
  a. href = url;
  a. download = `batch_predictions_${Date.now()}.csv`;
  a.click();
  window. URL.revokeObjectURL(url);
};