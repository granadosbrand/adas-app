import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Types
export interface RecordItem {
    id: string;
    timestamp: string;
}

interface RecordsState {
    records: RecordItem[];
    addRecord: (rec: RecordItem) => void;
    addNow: () => void;
    removeRecord: (id: string) => void;
    clear: () => void;
    getCount: () => number;
}

// Define the store with persistence
const useRecordStore = create<RecordsState>()(
    persist(
        (set, get) => ({
            records: [],
            addRecord: (rec: RecordItem) => set((state) => ({ records: [rec, ...state.records] })),
            addNow: () => {
                const now = new Date();
                const rec: RecordItem = { id: String(now.getTime()), timestamp: now.toISOString() };
                set((state) => ({ records: [rec, ...state.records] }));
            },
            removeRecord: (id: string) => set((state) => ({ records: state.records.filter((r) => r.id !== id) })),
            clear: () => set({ records: [] }),
            getCount: () => get().records.length,
        }),
        {
            name: 'adas-records-storage', // Clave única para AsyncStorage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useRecordStore;