import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
