let navigator: (path: string) => void;

export const setNavigator = (navFn: (path: string) => void) => {
    navigator = navFn;
};

export const navigateTo = (path: string) => {
    if (navigator) {
        navigator(path);
    } else {
        console.warn("Navigator no está seteado aún.");
    }
};