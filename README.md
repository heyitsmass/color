## Project: Color - Tailwind Palette Visualizer & Explorer

**1. Goal/Vision:**
To provide a developer-focused tool built with Vite for visualizing standard Tailwind CSS color palettes, generating custom palettes based on Material Design's algorithmic approach, and exploring color combinations with WCAG contrast ratio checks.

**2. Core Features:** 
*   **Tailwind Palette Visualizer:** Displays the default Tailwind CSS color palettes (e.g., `red-50` to `red-900`) in a clear, interactive format, showing hex codes, RGB values, etc.
*   **Material UI Algorithm Palette Generator:**
    *   Accepts a primary color input (e.g., hex code).
    *   Implements the Material Design logic (or a close interpretation) to generate a full palette (e.g., shades 50-900) based on hue, saturation, lightness transformations derived from the input color.
    *   Visualizes the generated custom palette.
*   **Contrast Ratio Checker:**
    *   Allows users to select two colors (e.g., text and background) from Tailwind palettes, generated palettes, or custom inputs.
    *   Calculates the WCAG contrast ratio between the selected colors.
    *   Displays the ratio and indicates WCAG AA/AAA compliance level for normal and large text.

**3. Key Components / Architecture:** 
*   **Frontend Application (Vite + React):**
    *   **UI Components:**
        *   `PaletteDisplay`: Renders color swatches for a given palette (Tailwind or generated).
        *   `PaletteGeneratorInput`: Form for primary color input.
        *   `ContrastChecker`: UI for selecting two colors and displaying results.
    *   **Color Data:** Contains Tailwind's default color definitions.
    *   **Material Algorithm Module:** JavaScript/TypeScript implementation of the color generation logic (hue shifts, saturation/lightness adjustments).
    *   **Contrast Calculation Module:** Implements the WCAG contrast ratio formula.
    *   **State Management:** Handles user inputs, selected colors, generated palettes.

**4. Tech Stack:**
*   Build Tool: Vite
*   Framework: React
*   Styling: Tailwind CSS
*   Color Libraries: implemented manually.

**5. Potential Challenges:**
*   Fine-tuning the Material algorithm implementation for desired aesthetic results.
*   Ensuring accurate color space conversions if needed for calculations.
*   Optimizing visualizations for large palettes.
*   User experience for selecting/comparing many colors.
