import { useState, useEffect } from "react";

export default function App() {
  const [scenario, setScenario] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState("light");

  // Funkcja do załadowania pliku JSON
  const loadScenario = async () => {
    try {
      const response = await fetch(process.env.PUBLIC_URL + "/TK8.json");
      if (!response.ok) {
        throw new Error("Failed to load TK8.json");
      }
      const data = await response.json();
      setScenario(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error loading scenario:", error);
      alert("Failed to load TK8.json");
    }
  };
  

  // Ładowanie scenariusza po załadowaniu komponentu
  useEffect(() => {
    loadScenario();
  }, []);

  // Obsługa klawiszy do przewijania
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
      if (e.key === "ArrowDown" && currentIndex < scenario.length - 5) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, scenario.length]);

  // Funkcja do zmiany trybu
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      style={{
        ...theme === "dark" ? darkTheme.container : lightTheme.container,
      }}
    >
      <h1 style={theme === "dark" ? darkTheme.heading : lightTheme.heading}>Scenariusz</h1>

      {/* Przycisk trybu ciemnego */}
      <button
        onClick={toggleTheme}
        style={{
          ...theme === "dark" ? darkTheme.darkModeButton : lightTheme.darkModeButton,
        }}
      >
        Tryb {theme === "dark" ? "jasny" : "ciemny"}
      </button>

      <div
        style={{
          ...theme === "dark" ? darkTheme.scenarioBox : lightTheme.scenarioBox,
          transition: "all 0.5s ease",
          scrollBehavior: "smooth", // Płynne przewijanie
        }}
        onWheel={(e) => {
          // Przewijanie myszką
          if (e.deltaY > 0 && currentIndex < scenario.length - 5) {
            setCurrentIndex((prev) => prev + 1);
          }
          if (e.deltaY < 0 && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          }
        }}
      >
        {scenario.slice(currentIndex, currentIndex + 5).map((line, index) => (
          <div
            key={index}
            style={{
              ...line.type === "technical"
                ? { ...techStyle, color: "#FFDB4D", fontWeight: "bold" }
                : line.type === "music"
                ? { ...musicStyle, color: "#4D79FF", fontWeight: "bold" }
                : theme === "dark"
                ? darkTheme.dialogBox
                : lightTheme.dialogBox,
            }}
          >
            {/* Adnotacje techniczne i muzyczne */}
            {line.type === "technical" || line.type === "music" ? (
              <p
                style={{
                  ...line.type === "technical"
                    ? { ...techStyle, textAlign: "right", fontStyle: "italic" }
                    : { ...musicStyle, textAlign: "right", fontStyle: "italic" },
                }}
              >
                {line.text}
              </p>
            ) : (
              <>
                <p
                  style={
                    theme === "dark"
                      ? darkTheme.person
                      : lightTheme.person
                  }
                >
                  {line.person}:
                </p>
                <p
                  style={
                    theme === "dark"
                      ? darkTheme.text
                      : lightTheme.text
                  }
                >
                  {line.text}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <p
        style={{
          ...theme === "dark" ? darkTheme.infoText : lightTheme.infoText,
        }}
      >
        Użyj strzałek góra/dół do przewijania!
      </p>
    </div>
  );
}

// Style dla trybu jasnego
const lightTheme = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Pełny ekran
    fontFamily: "'Roboto', sans-serif",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f4f4f9", // Jasne tło
    color: "#333",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "30px",
  },
  darkModeButton: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "50px", // Zaokrąglony przycisk
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "1rem",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    marginTop: "20px",
  },
  scenarioBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginTop: "30px",
    maxHeight: "80vh", // Wysokość 80% ekranu
    overflowY: "auto",
    width: "100%",
  },
  dialogBox: {
    border: "2px solid #ccc",
    borderRadius: "15px", // Zaokrąglony prostokąt
    padding: "25px",
    width: "80%",
    backgroundColor: "#fff",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    wordWrap: "break-word",
    transition: "transform 0.3s ease-in-out", // Płynna animacja przy zmianie
  },
  person: {
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#FF5733", // Czerwony kolor postaci
  },
  text: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    textAlign: "left",
  },
  infoText: {
    marginTop: "20px",
    color: "#777",
  },
};

// Style dla trybu ciemnego
const darkTheme = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Pełny ekran
    fontFamily: "'Roboto', sans-serif",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#1E1E1E", // Ciemne tło
    color: "#fff",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#fff",
    marginBottom: "30px",
  },
  darkModeButton: {
    backgroundColor: "#555",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "50px", // Zaokrąglony przycisk
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "1rem",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
    marginTop: "20px",
  },
  scenarioBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginTop: "30px",
    maxHeight: "80vh", // Wysokość 80% ekranu
    overflowY: "auto",
    width: "100%",
  },
  dialogBox: {
    border: "2px solid #444",
    borderRadius: "15px", // Zaokrąglony prostokąt
    padding: "25px",
    width: "80%",
    backgroundColor: "#333",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.5)",
    textAlign: "left",
    wordWrap: "break-word",
    transition: "transform 0.3s ease-in-out", // Płynna animacja przy zmianie
  },
  person: {
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#FF5733", // Czerwony kolor postaci
  },
  text: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    textAlign: "left",
  },
  infoText: {
    marginTop: "20px",
    color: "#888",
  },
};

const techStyle = {
  fontSize: "1.1rem",
  textAlign: "right",
  fontStyle: "italic",
};

const musicStyle = {
  fontSize: "1.1rem",
  textAlign: "right",
  fontStyle: "italic",
};
