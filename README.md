# Open Archive Collective

A movement to liberate information, education, and knowledge for every single soul.

## Overview

The Open Archive Collective is a web application dedicated to the free distribution of knowledge. It serves as a platform to advocate for the liberation of information from paywalls and restrictions, and provides a space for sharing educational resources, books, research papers, and software.

This project is built with modern web technologies, focusing on performance, accessibility, and a clean user experience.

## Features

-   **Manifesto**: A comprehensive declaration of our philosophy regarding the freedom of knowledge.
-   **Library**: A searchable collection of free resources (books, research, software).
-   **Mission**: Detailed information about our core values: Universal Access, Freedom First, Community Driven, and Privacy Respected.
-   **Contribute**: A portal for users to upload and share knowledge with the world.
-   **Responsive Design**: Fully responsive interface built with Tailwind CSS.

## Tech Stack

-   **Frontend Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **State Management**: [TanStack Query](https://tanstack.com/query/latest)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm, yarn, pnpm, or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd open-archive-collective
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8080` (or the port shown in your terminal).

### Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Linting

To run the linter:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui primitive components
│   ├── Navigation.tsx # Main navigation bar
│   ├── QuoteBlock.tsx # Reusable quote component
│   └── ...
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
│   ├── Home.tsx       # Landing page
│   ├── Manifesto.tsx  # The Freedom Manifesto
│   ├── Library.tsx    # Resource library
│   ├── Mission.tsx    # Mission statement and values
│   ├── Contribute.tsx # Contribution page
│   └── ...
├── App.tsx            # Main application component and routing
└── main.tsx           # Entry point
```

## Contributing

We welcome contributions from everyone who believes in the freedom of knowledge.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m "Add some amazing feature"`).
5.  Push to the branch (`git push origin feature/amazing-feature`).
6.  Open a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

-   Built with [Lovable](https://lovable.dev/)
-   Icons by [Lucide](https://lucide.dev/)
-   UI components by [shadcn/ui](https://ui.shadcn.com/)
