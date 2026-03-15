import json
import uuid
import random
from datetime import datetime, timedelta

def dt(days_ago=0):
    return (datetime.utcnow() - timedelta(days=days_ago, hours=random.randint(0,23))).isoformat() + 'Z'

CITIES = [
  {'name': 'Mumbai', 'lat': 19.0760, 'lng': 72.8777, 'base': 120},
  {'name': 'Delhi', 'lat': 28.7041, 'lng': 77.1025, 'base': 250},
  {'name': 'Bangalore', 'lat': 12.9716, 'lng': 77.5946, 'base': 85},
  {'name': 'Chennai', 'lat': 13.0827, 'lng': 80.2707, 'base': 95},
  {'name': 'Hyderabad', 'lat': 17.3850, 'lng': 78.4867, 'base': 110}
]

SECTORS = ['Manufacturing', 'Chemicals', 'Textiles', 'Energy', 'Automotive', 'Construction']
CATS = ['Air', 'Water', 'Noise', 'Waste', 'Deforestation']
SEVS = ['Low', 'Medium', 'High', 'Critical']

users = []
for i in range(50):
    role = 'citizen' if i < 30 else 'industry' if i < 40 else 'government'
    u = {
        'id': str(uuid.uuid4()),
        'name': f'User {i}',
        'email': f'user{i}@prithvinet.gov.in',
        'role': role,
        'city': random.choice(CITIES)['name'],
        'avatar': f'https://i.pravatar.cc/150?u={i}',
        'joined_at': dt(random.randint(10, 800))
    }
    if role == 'citizen':
        u['eco_score'] = random.randint(10, 1000)
        u['complaints_filed'] = random.randint(0, 15)
    elif role == 'industry':
        u['compliance_rating'] = random.randint(40, 98)
        u['industry_sector'] = random.choice(SECTORS)
    else:
        u['department'] = random.choice(['Pollution Control Board', 'Municipal Corporation', 'Environmental Ministry'])
    users.append(u)

sensors = []
for i in range(120):
    c = random.choice(CITIES)
    val = random.randint(max(0, c['base'] - 40), c['base'] + 150)
    sev = 'Critical' if val > 300 else 'High' if val > 200 else 'Medium' if val > 100 else 'Low'
    sensors.append({
        'id': f'SENS-{1000+i}',
        'city': c['name'],
        'area': f"{c['name']} Zone {chr(65 + (i%5))}",
        'lat': round(c['lat'] + random.uniform(-0.1, 0.1), 4),
        'lng': round(c['lng'] + random.uniform(-0.1, 0.1), 4),
        'pollutant_type': random.choice(['PM2.5', 'PM10', 'NO2', 'SO2', 'CO']),
        'value': val,
        'severity': sev,
        'trend': random.choice(['Improving', 'Stable', 'Worsening']),
        'last_updated': dt(0)
    })

complaints = []
for i in range(80):
    stat = random.choice(['Pending', 'In Progress', 'Resolved', 'Rejected'])
    cit = random.choice([u for u in users if u['role'] == 'citizen'])
    gov = random.choice([u for u in users if u['role'] == 'government'])
    complaints.append({
        'id': f'CMP-{5000+i}',
        'title': random.choice(['Illegal dumping', 'Thick smoke', 'Chemical odor', 'Construction dust', 'Discolored water']),
        'description': 'Detailed report of environmental violation.',
        'category': random.choice(CATS),
        'severity': random.choice(SEVS),
        'status': stat,
        'location': f"{cit['city']} Sector {random.randint(1,20)}",
        'reported_by': cit['id'],
        'assigned_to': gov['id'],
        'created_at': dt(random.randint(30, 300)),
        'resolved_at': dt(random.randint(1, 29)) if stat == 'Resolved' else None,
        'ai_priority_score': random.randint(10, 99)
    })

industries = []
for i in range(40):
    score = random.randint(45, 99)
    risk = 'Critical' if score < 60 else 'High' if score < 75 else 'Medium' if score < 85 else 'Low'
    industries.append({
        'id': f'IND-{8000+i}',
        'industry_name': f"{random.choice(['Apex', 'Global', 'Prime', 'Eco', 'National'])} {random.choice(['Corp', 'Industries', 'Mills', 'Refinery'])}",
        'sector': random.choice(SECTORS),
        'location': f"{random.choice(CITIES)['name']} Estate",
        'compliance_score': score,
        'violations_count': random.randint(0, 12),
        'emission_index': round(random.uniform(0.5, 5.0), 2),
        'wastewater_index': round(random.uniform(1.0, 8.0), 2),
        'last_audit': dt(random.randint(10, 200)),
        'risk_level': risk,
        'trend': random.choice(['Improving', 'Stable', 'Worsening'])
    })

policies = []
for i in range(25):
    policies.append({
        'id': f'POL-{200+i}',
        'title': random.choice(['Emission Act', 'River Protection', 'Noise Limits', 'Plastic Protocol']),
        'category': random.choice(CATS),
        'affected_city': random.choice([c['name'] for c in CITIES] + ['National']),
        'impact_score': random.randint(50, 98),
        'implementation_stage': random.choice(['Draft', 'Consultation', 'Active', 'Review']),
        'ai_recommendation': 'Increase monitoring.',
        'risk_level': random.choice(['Low', 'Medium', 'High']),
        'predicted_outcome': f'{random.randint(10, 30)}% reduction.',
        'created_at': dt(random.randint(100, 600))
    })

alerts = []
for i in range(60):
    alerts.append({
        'id': f'ALT-{9000+i}',
        'type': random.choice(['sensor', 'citizen', 'ai']),
        'severity': random.choice(['Warning', 'Critical']),
        'title': random.choice(['Threshold Exceeded', 'Thermal Activity', 'Complaints Spike']),
        'description': 'System detected anomalies.',
        'location': random.choice(CITIES)['name'],
        'probability': f'{random.randint(60, 99)}%',
        'issued_by': 'System Core',
        'timestamp': dt(random.randint(0, 2)),
        'status': random.choice(['Active', 'Investigating', 'Closed'])
    })

reports = []
for i in range(40):
    reports.append({
        'id': f'REP-{3000+i}',
        'title': 'Quarterly Assessment',
        'category': random.choice(CATS),
        'region': random.choice(CITIES)['name'],
        'metrics': {'avg_value': random.randint(40, 200), 'peak': random.randint(200, 500)},
        'trend': random.choice(['Improving', 'Stable', 'Worsening']),
        'status': random.choice(['Finalized', 'Pending Review']),
        'generated_by': random.choice([u for u in users if u['role'] == 'government'])['id'],
        'created_at': dt(random.randint(10, 100))
    })

ai_predictions = []
for i in range(30):
    ai_predictions.append({
        'id': f'PRED-{100+i}',
        'region': random.choice(CITIES)['name'],
        'prediction_type': random.choice(['AQI Spike', 'Effluent Overflow', 'Compliance Drop']),
        'probability': round(random.uniform(0.7, 0.99), 2),
        'time_horizon': random.choice(['24 Hours', '7 Days', '1 Month']),
        'impact_level': random.choice(SEVS),
        'suggested_action': 'Deploy mobile units.'
    })

system_monitoring = {
    'total_sensors_online': 10452,
    'sensors_offline': 148,
    'critical_alerts_today': 34,
    'avg_response_time': '1.2 hours',
    'compliance_index': 76.4,
    'pollution_trend_national': 'Improving'
}

with open('final_dataset.json', 'w') as f:
    json.dump({
        'users': users,
        'sensors': sensors,
        'complaints': complaints,
        'industries': industries,
        'policies': policies,
        'alerts': alerts,
        'reports': reports,
        'ai_predictions': ai_predictions,
        'system_monitoring': system_monitoring
    }, f)
