const CITIES = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, baseAQI: 120 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025, baseAQI: 280 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, baseAQI: 85 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, baseAQI: 95 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, baseAQI: 110 }
];

export const generateSeedData = () => {
  const users = Array.from({ length: 50 }).map((_, i) => ({
    id: `usr-${i}`,
    name: i === 0 ? "Arjun Mehra" : `User ${i}`,
    email: i === 0 ? "arjun@citizen.in" : `user${i}@prithvinet.in`,
    role: i < 30 ? 'citizen' : i < 40 ? 'industry' : 'government',
    city: CITIES[i % 5].name,
    avatar: `https://i.pravatar.cc/150?u=${i}`,
    joined_at: new Date(2023, 5, i + 1).toISOString(),
    eco_score: i < 30 ? Math.floor(Math.random() * 800) + 200 : null,
    industry_id: i >= 30 && i < 40 ? `ind-${i}` : null
  }));

  const sensors = Array.from({ length: 120 }).map((_, i) => {
    const city = CITIES[i % 5];
    const value = Math.floor(Math.random() * 200) + (city.baseAQI - 50);
    return {
      id: `sns-${i}`,
      city: city.name,
      lat: city.lat + (Math.random() - 0.5) * 0.2,
      lng: city.lng + (Math.random() - 0.5) * 0.2,
      value,
      pollutant_type: 'PM2.5',
      severity: value > 250 ? 'Critical' : value > 150 ? 'High' : 'Moderate',
      last_updated: new Date().toISOString()
    };
  });

  const industries = Array.from({ length: 40 }).map((_, i) => {
    const score = Math.floor(Math.random() * 40) + 55;
    return {
      id: `ind-${i + 30}`,
      name: `${CITIES[i % 5].name} Heavy Industries`,
      sector: ['Chemicals', 'Energy', 'Manufacturing', 'Textiles'][i % 4],
      compliance_score: score,
      risk_level: score < 70 ? 'High' : 'Low',
      emission_index: (Math.random() * 5).toFixed(2),
      last_audit: new Date(2024, 1, i % 28).toISOString()
    };
  });

  const complaints = Array.from({ length: 80 }).map((_, i) => ({
    id: `CMP-${1000 + i}`,
    title: 'Excessive Factory Smoke',
    description: 'Noticeable dark emissions during night hours.',
    category: 'Air',
    severity: i % 10 === 0 ? 'Critical' : 'High',
    status: i % 3 === 0 ? 'Resolved' : 'Pending',
    reported_by: `usr-${i % 30}`,
    created_at: new Date(2024, 2, i % 14).toISOString()
  }));

  return {
    users,
    currentUser: users[0],
    complaints,
    sensors,
    industries,
    alerts: [],
    policies: [],
    reports: [],
    aiPredictions: [],
    systemMonitoring: { total_sensors_online: 10452, sensors_offline: 148, avg_response_time: '1.2h' }
  };
};
