import { create } from "zustand";

interface IMediaStore {
    isMobile: boolean;
    checkScreenSize: () => void;
}

export const mediaStore = create<IMediaStore>((set) => ({
    isMobile: window.innerWidth <= 900,
    checkScreenSize: () => {
        set({ isMobile: window.innerWidth <= 900 });
    },
}));

window.addEventListener("resize", () => {
    mediaStore.getState().checkScreenSize();
});
