import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { delay } from '../utils/fakeDelay';
import { generateSeedData } from '../data/seedSystem';

export const useSystemStore = create(
  persist(
    (set, get) => ({
      ...generateSeedData(),

      // Citizen Logic
      addComplaint: async (data) => {
        await delay();
        const newComplaint = { 
          ...data, 
          id: `CMP-${Math.floor(Math.random() * 9000) + 1000}`, 
          created_at: new Date().toISOString(),
          reported_by: get().currentUser.id 
        };
        set(state => ({ complaints: [newComplaint, ...state.complaints] }));
      },

      resolveComplaint: async (id) => {
        await delay(500);
        set(state => ({
          complaints: state.complaints.map(c => c.id === id ? { ...c, status: 'Resolved' } : c)
        }));
      },

      // User / Profile
      updateUserProfile: async (data) => {
        await delay();
        set(state => ({
          currentUser: { ...state.currentUser, ...data },
          users: state.users.map(u => u.id === state.currentUser.id ? { ...u, ...data } : u)
        }));
      },

      uploadAvatar: async (base64) => {
        await delay(1200);
        get().updateUserProfile({ avatar: base64 });
      },

      // Industry Logic
      submitIndustryReport: async (reportData) => {
        await delay(1500);
        const newReport = {
          ...reportData,
          id: `REP-${Date.now()}`,
          status: 'Pending Review',
          submitted_by: get().currentUser.id,
          created_at: new Date().toISOString()
        };
        set(state => ({ reports: [newReport, ...state.reports] }));
      },

      updateCompliance: async (industryId, score) => {
        set(state => ({
          industries: state.industries.map(ind => ind.id === industryId ? { ...ind, compliance_score: score } : ind)
        }));
      },

      // Government / Admin Logic
      addPolicy: async (policy) => {
        await delay(1000);
        set(state => ({ policies: [{ ...policy, id: `POL-${Date.now()}` }, ...state.policies] }));
      },

      triggerAlert: async (alert) => {
        const newAlert = { ...alert, id: `ALT-${Date.now()}`, timestamp: new Date().toISOString() };
        set(state => ({ alerts: [newAlert, ...state.alerts] }));
      },

      generateReport: async (params) => {
        await delay(2000);
        // Logic for automated analytical reports
      }
    }),
    {
      name: "prithvinet-system-db"
    }
  )
);
