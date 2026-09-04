import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

export type Theme =
    | "light"
    | "dark"
    | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext =
    createContext<
        ThemeContextType | undefined
    >(undefined);


/* =========================================================
   GET SYSTEM THEME
========================================================= */

function getSystemTheme(): "light" | "dark" {

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";
}


/* =========================================================
   GET SAVED THEME
========================================================= */

function getSavedTheme(): Theme {

    const saved =
        localStorage.getItem("theme");

    if (
        saved === "light" ||
        saved === "dark" ||
        saved === "system"
    ) {
        return saved;
    }

    return "light";
}


/* =========================================================
   APPLY THEME
========================================================= */

function applyTheme(theme: Theme) {

    const root =
        document.documentElement;

    const actualTheme =
        theme === "system"
            ? getSystemTheme()
            : theme;


    root.classList.remove(
        "light",
        "dark"
    );


    root.classList.add(
        actualTheme
    );


    root.setAttribute(
        "data-theme",
        actualTheme
    );


    root.style.colorScheme =
        actualTheme;
}


/* =========================================================
   PROVIDER
========================================================= */

export function ThemeProvider({
                                  children,
                              }: {
    children: React.ReactNode;
}) {

    const [
        theme,
        setThemeState,
    ] =
        useState<Theme>(
            getSavedTheme()
        );


    /* =====================================================
       APPLY THEME
    ===================================================== */

    useEffect(() => {

        applyTheme(theme);

        localStorage.setItem(
            "theme",
            theme
        );

    }, [theme]);


    /* =====================================================
       SYSTEM THEME CHANGE
    ===================================================== */

    useEffect(() => {

        if (
            theme !== "system"
        ) {
            return;
        }


        const mediaQuery =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            );


        const handleChange = () => {

            applyTheme(
                "system"
            );
        };


        mediaQuery.addEventListener(
            "change",
            handleChange
        );


        return () => {

            mediaQuery.removeEventListener(
                "change",
                handleChange
            );
        };

    }, [theme]);


    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme: setThemeState,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}


/* =========================================================
   HOOK
========================================================= */

export function useTheme() {

    const context =
        useContext(
            ThemeContext
        );


    if (!context) {

        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }


    return context;
}