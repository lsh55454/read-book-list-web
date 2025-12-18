# 📚 Read Book List Web

> A modern web application for managing your personal reading list with integrated book search functionality.

## ⚠️ Important Notice

**Before restarting the project, you need to upgrade React and Next.js:**
- Upgrade to the latest stable versions of React and Next.js
- Run `npm install` or `npm update` to apply the upgrades
- Test the application thoroughly after the upgrade to ensure compatibility

---

## 📖 Project Overview

**Read Book List Web** is a full-stack web application built with Next.js that helps users manage their personal book reading list. The application integrates with the Aladin Book API to search for books and maintain a comprehensive reading log.

### Key Features

- 📖 **Book Search**: Search for books using the Aladin Book API (Korean book database)
- 📝 **Reading List Management**: Add books to your personal reading list
- 📊 **Reading Status Tracking**: Track reading progress and completion status
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 🚀 **Optimized Performance**: Built with Next.js 15 and React 19 with Turbopack support

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19.1.0, TypeScript, Tailwind CSS 4 |
| **Backend** | Next.js 15.5.3, Node.js |
| **Styling** | Tailwind CSS 4, PostCSS |
| **Development** | TypeScript 5, ESLint 9, Turbopack |
| **APIs** | Aladin Book Search API |

---

## 📁 Project Structure

```
read-book-list-web/
├── app/
│   ├── layout.tsx                    # Root layout component
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Global styles
│   └── api/
│       ├── books/route.ts            # Books management API endpoint
│       ├── pages/route.ts            # Pages management API endpoint
│       └── search/route.ts           # Book search API endpoint (Aladin integration)
├── src/
│   ├── components/
│   │   └── footer.tsx                # Footer component
│   ├── data/
│   │   └── books.json                # Local book database
│   └── lib/
│       └── aladin.ts                 # Aladin API client and types
├── package.json                      # Project dependencies
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
└── eslint.config.mjs                 # ESLint configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd read-book-list-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   ALADIN_TTB_KEY=your_aladin_ttb_key_here
   ```
   
   > 📌 Get your Aladin TTB Key: https://blog.aladin.co.kr/parameter/blogHome/ttbManager

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at [http://localhost:3000](http://localhost:3000)

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server with Turbopack (fast refresh) |
| `npm run build` | Build the production bundle with Turbopack optimization |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |

---

## 🔌 API Endpoints

### `/api/search`
Search for books using the Aladin API

**Method:** GET  
**Parameters:**
- `query` (string): Book title, author, or ISBN to search

**Example:**
```bash
GET /api/search?query=harry+potter
```

### `/api/books`
Manage the user's reading list

**Method:** GET/POST  
**Functionality:** Retrieve or add books to the reading list

### `/api/pages`
Manage reading progress

**Method:** GET/POST  
**Functionality:** Track current reading page and total pages

---

## 📚 Book Data Structure

Books in the system contain the following information:

```typescript
{
  title: string;              // Book title
  author: string;             // Author name(s)
  isbn: string;               // ISBN-10
  cover: string;              // Book cover image URL
  publisher: string;          // Publisher name
  pubDate: string;            // Publication date (YYYY-MM-DD)
  description: string;        // Book description
  itemPage: number;           // Total number of pages
  status: string;             // Reading status (e.g., "completed", "reading", "to-read")
  addedDate: string;          // Date added to reading list (ISO 8601)
  currentPage: number;        // Current reading page
  totalPages: number;         // Total pages for tracking
}
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ALADIN_TTB_KEY` | API key for Aladin Book Search API | Yes |

Store sensitive data in `.env.local` (never commit to version control)

---

## 🎨 Styling

The project uses **Tailwind CSS 4** for utility-first styling with PostCSS for processing. Configuration is available in `tailwind.config.js`.

---

## 🧪 Development Tips

- The project uses **Turbopack** for faster build and dev times
- **TypeScript** is configured for type safety
- **ESLint** helps maintain code quality
- Use browser DevTools to debug React components
- Check the Aladin API documentation for search parameters and book data structure

---

## 📄 License

This project is part of a personal learning initiative.

---

## 📞 Support

For issues or questions about the Aladin Book API integration, refer to:
- [Aladin Book API Documentation](https://blog.aladin.co.kr/parameter/blogHome/ttbManager)

---

**Last Updated:** December 2025  
**Version:** 0.1.0
