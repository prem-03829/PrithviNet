import { useState, useEffect } from 'react';
import { sensorService } from '../services/sensorService';

export function useRealtimeSensors() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatus = (aqi) => {
    if (aqi > 300) return 'critical';
    if (aqi > 150) return 'unhealthy';
    if (aqi > 50) return 'moderate';
    return 'good';
  };

  useEffect(() => {
    let mounted = true;
    const fetchSensors = async () => {
      setLoading(true);
      const data = await sensorService.getSensors();
      if (mounted) {
        setSensors(data);
        setLoading(false);
      }
    };

    fetchSensors();

    const interval = setInterval(() => {
      setSensors(current => current.map(s => {
        const change = Math.floor(Math.random() * 7) - 3;
        const newAqi = Math.max(0, s.aqi + change);
        return {
          ...s,
          aqi: newAqi,
          status: getStatus(newAqi),
          trend: change
        };
      }));
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { sensors, loading };
}
