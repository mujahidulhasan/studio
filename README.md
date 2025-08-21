
# **Project Name**: ID Maker

## **1. Overview**

**ID Maker** is a web-based application that allows users to design, create, and manage professional-looking ID cards and badges. It provides a user-friendly interface with a suite of design tools, including template selection, image and text manipulation, and element customization. The application supports user accounts to save and manage designs, a record management system for creating ID data, and an AI-powered tool to check photo suitability.

## **2. Core Features**

### **2.1. ID Card Designer & Canvas**
- **Interactive Canvas:** A central workspace where users can visually design the ID card.
- **Template Selection:**
  - Users can select from predefined templates (e.g., "Modern," "Classic," "Vertical").
  - Ability to switch between horizontal and vertical orientations.
- **Element Manipulation:**
  - **Selection:** Click to select any element (image, text, shape) on the canvas.
  - **Drag & Drop:** Reposition elements freely on the canvas.
  - **Resize & Rotate:** Interactive handles on selected elements for resizing and rotation.
  - **Layering:** Bring elements forward or send them backward.
  - **Locking:** Lock elements to prevent accidental edits.
  - **Duplication & Deletion:** Easily duplicate or delete any selected element.
- **Side Switching:** A toggle to switch between designing the "Front" and "Back" of the ID card.
- **Undo/Redo:** Full history support for all design actions.
- **Grid System:** Toggle a visual grid on the canvas for precise alignment.
- **Download:** Download the final ID card design as a high-quality SVG file.

### **2.2. Design Tools & Panels**
- **Icon-Based Toolbar:** A primary toolbar for switching between different tool panels (Templates, Text, Images, Shapes, Records).
- **Contextual "Customize" Panel:** A dynamic panel that appears when an element is selected, showing options relevant to that element (e.g., color, font size, border thickness).
- **Image Tools:**
  - **Upload:** Upload a static image (e.g., a logo) or a variable headshot image from the local system.
  - **AI Suitability Check:** An AI-powered tool to evaluate if an uploaded photo is suitable for an ID (checks for face visibility, lighting, quality).
  - **Image Customization:** Adjust transparency, rotation, border size, and border color.
- **Text Tools:**
  - **Add Text:** Add single-line or multi-line text boxes.
  - **Variable Text:** Insert placeholders for dynamic data (e.g., `{{fullName}}`, `{{title}}`).
  - **Text Customization:** Modify content, font family, font size, color, alignment (left, center, right), and style (bold, italic, underline).
- **Shape Tools:**
  - **Add Shapes:** Add basic shapes like rectangles, circles, triangles, and lines.
  - **Shape Customization:** Adjust fill color, stroke color, stroke width, and transparency.

### **2.3. User Authentication & Account Management**
- **Authentication:** Users can sign up and log in using an email and password.
- **Account Page:** A dedicated page for authenticated users to manage their creations.
  - **My Designs:** View a gallery of all saved ID card designs. Users can edit or delete their designs.
  - **My Records:** View a list of all created student/employee records. Users can edit or delete their records.
- **Save Designs:** Authenticated users can save their current design progress to their account.

### **2.4. Record Management System**
- **Create Records:** A multi-step form to create new records (e.g., for students or employees).
  - Collects personal info (name, roll, registration), family info, and additional details (DOB, NID, social links).
  - Allows uploading a profile picture for the record.
- **Search Records:** A dedicated page to search for existing records by ID, name, or roll number for quick retrieval.
- **Variable Data Source:** These records can serve as the data source for populating variable text fields on the ID cards.

## **3. Style & UI/UX Guidelines**

- **Primary Color:** Sky Blue (`#78B0FF`) - Used for active states, primary buttons, and key UI elements to build trust.
- **Accent Color:** Soft Green (`#A0D468`) - Used for important calls-to-action like the "Download" button.
- **Background Color:** Light Gray (`#F0F4F8`) - Provides a clean, professional, and neutral backdrop.
- **Font:** `Inter` - A modern, grotesque sans-serif font for all headlines and body text to ensure readability.
- **Component Style:** Use minimalist icons (from `lucide-react`), rounded corners, and subtle shadows for a modern and clean aesthetic.
- **Layout:** A three-column layout for the main designer:
  - **Left:** Icon-based tool-switcher.
  - **Center:** The main canvas/workspace area.
  - **Right (Sliding Panels):** Context-aware panels for `Editor` and `Customize` tools that slide in and out smoothly.
- **User Feedback:** Use non-intrusive toast notifications for feedback (e.g., "Design Saved," "Error," AI suitability reports).

## **4. Technical Specifications**

- **Frontend Framework:** Next.js (App Router) with React.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS with ShadCN UI components for the core component library and theme.
- **State Management:** React Hooks (`useState`, `useContext`, custom hooks) for component and application state.
- **AI Integration:** Genkit for connecting to Google's Generative AI models (for the image suitability check).
- **Backend & Database:** Firebase
  - **Authentication:** Firebase Authentication for user management.
  - **Database:** Firestore for storing user designs and records.
  - **Storage:** Firebase Storage for storing uploaded images (avatars, logos).
- **Deployment:** Firebase App Hosting, configured via `firebase.json` and `apphosting.yaml`.

## **5. File Structure (Key Files)**
- `src/app/page.tsx`: The main ID card designer page.
- `src/app/account/page.tsx`: The user's account management page.
- `src/app/records/page.tsx`: The record search page.
- `src/components/`: Contains all reusable React components.
  - `id-card-preview.tsx`: The interactive canvas component.
  - `editor-panel.tsx`: The main container for tool editors.
  - `customize-panel.tsx`: The main container for element customization.
  - `header.tsx`: The main application header.
  - `record-editor.tsx`: The form for creating new records.
- `src/context/auth-context.tsx`: Manages user authentication state globally.
- `src/services/`: Contains server-side logic for interacting with Firebase (e.g., `design-service.ts`, `record-service.ts`).
- `src/ai/flows/`: Contains Genkit flows for AI functionality.
  - `check-image-suitability.ts`: The flow for the AI photo check.
- `src/types/index.ts`: Defines all TypeScript interfaces for the application data structures.
- `src/app/globals.css`: Defines the global styles and theme variables for ShadCN/Tailwind.
- `firebase.json` & `apphosting.yaml`: Configuration files for deployment on Firebase.
