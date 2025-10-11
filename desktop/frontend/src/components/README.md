# Components Structure

This directory contains all reusable React components organized by category.

## Folder Structure

```
components/
├── ui/                    # Basic UI components
│   ├── Button.tsx        # Reusable button component with variants
│   ├── Input.tsx         # Form input component
│   ├── Select.tsx        # Dropdown select component
│   └── Card.tsx          # Card container component
├── forms/                # Form-related components
│   ├── ProjectSelector.tsx    # Project dropdown selector
│   ├── TaskCreationForm.tsx   # Inline task creation form
│   └── ProjectCreationForm.tsx # Project creation modal form
├── modals/               # Modal components
│   ├── Modal.tsx         # Base modal component
│   └── ConfirmationModal.tsx # Confirmation dialog
├── task/                 # Task-related components
│   ├── TaskItem.tsx      # Individual task display component
│   └── ActiveTaskBanner.tsx # Active task status banner
├── project/              # Project-related components
│   └── ProjectItem.tsx   # Individual project display component
├── layout/               # Layout and navigation components
│   ├── Logo.tsx          # App logo with size variants
│   ├── WorkControls.tsx  # Work start/stop/pause/resume controls
│   ├── StatusIndicator.tsx # Work status indicator
│   ├── TabNavigation.tsx # Tab navigation component
│   ├── Header.tsx        # Main header component (minimized/full)
│   ├── MainContent.tsx   # Main content area with tab rendering
│   └── FloatingElements.tsx # Background floating elements
└── index.ts              # Central export file
```

## Component Guidelines

### UI Components
- **Button**: Supports multiple variants (primary, secondary, danger, success) and sizes
- **Input**: Standardized form input with consistent styling
- **Select**: Dropdown with custom styling and chevron icon
- **Card**: Container component with hover effects and click handling

### Form Components
- **ProjectSelector**: Reusable project dropdown used across screens
- **TaskCreationForm**: Inline form for quick task creation
- **ProjectCreationForm**: Modal form for project creation

### Modal Components
- **Modal**: Base modal with header, content, and close functionality
- **ConfirmationModal**: Specialized modal for confirmations

### Feature Components
- **TaskItem**: Complete task display with expand/collapse and actions
- **ActiveTaskBanner**: Status banner for currently active task
- **ProjectItem**: Complete project display with expand/collapse and actions

### Layout Components
- **Logo**: App logo component with size variants (sm/lg) and optional time display
- **WorkControls**: Work session controls (start/stop/pause/resume) with size variants
- **StatusIndicator**: Visual status indicator showing current work state
- **TabNavigation**: Tab navigation with active states and hover effects
- **Header**: Main header component supporting both minimized and full layouts
- **MainContent**: Main content area that handles tab rendering and layout
- **FloatingElements**: Background decorative floating elements

## Usage

Import components from the central index file:

```typescript
import { Button, Modal, TaskItem, Header, MainContent } from '../components';
```

## Benefits

1. **Reusability**: Components can be used across multiple screens
2. **Consistency**: Standardized styling and behavior
3. **Maintainability**: Changes to components affect all usages
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Organization**: Clear separation of concerns by category
