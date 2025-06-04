# Color Journal

## Description

Color Journal is a digital drawing application designed to help users express their emotions and capture memories through color and art. It serves as a daily visual diary where you can create, save, and revisit your creative expressions tied to specific dates.

## Features

### Drawing Tools
- **Multiple Brush Types**: Round, Square, Pixel, and Splatter brushes for different artistic effects
- **Fill Bucket Tool**: Quickly fill areas with your selected color
- **Pressure Sensitivity**: Support for pressure-sensitive input devices
- **Opacity Control**: Adjust the transparency of your brushes
- **Color Selection**: Choose from a wide range of colors to express your mood

### Journal Functionality
- **Daily Entries**: Create and save a unique drawing for each day
- **Calendar Navigation**: Easily switch between dates to view or edit past entries
- **Gallery View**: Browse through your past entries in a visual gallery

### File Management
- **Export Entries**: Save your drawings as PNG files to your device
- **Import Images**: Upload images to use as a starting point or reference
- **Auto-Save**: Your work is automatically saved as you draw

### Editing Capabilities
- **Undo/Redo**: Full support for undoing and redoing actions with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **Clear Canvas**: Start fresh with a clean canvas

## Technology Stack

- **Frontend**: React.js with hooks for state management
- **Styling**: Tailwind CSS for responsive design
- **Storage**: Browser's localStorage for saving entries
- **Deployment**: Netlify for hosting

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RubyTseng2538/ColorJournal.git
```

2. Navigate to the project directory:
```bash
cd ColorJournal
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Select a date** using the date picker at the top of the application
2. **Choose your drawing tools** from the toolbox on the left
   - Select a brush type (round, square, pixel, or splatter)
   - Adjust the brush size
   - Set the opacity level
   - Pick a color
3. **Draw on the canvas** in the center of the screen
4. Your work is automatically saved for the selected date
5. **Export your drawing** using the export button below the canvas
6. **Import an image** to use as a base for your drawing

## Keyboard Shortcuts

- `Ctrl+Z` or `⌘+Z` (Mac): Undo the last action
- `Ctrl+Y` or `⌘+Y` (Mac): Redo the last undone action
- `Ctrl+Shift+Z` or `⌘+Shift+Z` (Mac): Alternative shortcut for Redo

## Deployment

The application is automatically deployed to Netlify when changes are pushed to the main branch. You can visit the live site at [https://colorjournal.netlify.app/](https://colorjournal.netlify.app/)

Color Journal is more than just a drawing app - it's a tool for emotional expression, mindfulness, and creative exploration. We hope it helps you capture your daily experiences in a colorful and meaningful way.
