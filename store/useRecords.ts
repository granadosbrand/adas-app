import { create } from 'zustand';

// Types
export interface RecordItem {
    id: string;
    label: string;
}

interface RecordsState {
    records: RecordItem[];
    addRecord: (rec: RecordItem) => void;
    addNow: () => void;
    removeRecord: (id: string) => void;
    clear: () => void;
    getCount: () => number;
}

// Define the store
const useRecordStore = create<RecordsState>((set, get) => ({
    records: [],
    addRecord: (rec: RecordItem) => set((state) => ({ records: [rec, ...state.records] })),
    addNow: () => {
        const now = new Date();
        const rec: RecordItem = { id: String(now.getTime()), label: now.toLocaleString() };
        set((state) => ({ records: [rec, ...state.records] }));
    },
    removeRecord: (id: string) => set((state) => ({ records: state.records.filter((r) => r.id !== id) })),
    clear: () => set({ records: [] }),
    getCount: () => get().records.length,
}));

export default useRecordStore;