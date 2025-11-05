import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');

// Initialize storage
async function initializeStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(BOOKS_FILE);
    } catch {
      await fs.writeFile(BOOKS_FILE, JSON.stringify({ books: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// GET /api/books - Get all books
export async function GET() {
  try {
    await initializeStorage();
    const content = await fs.readFile(BOOKS_FILE, 'utf-8');
    const data = JSON.parse(content);
    return NextResponse.json(data.books);
  } catch (error) {
    console.error('Error reading books:', error);
    return NextResponse.json({ error: 'Failed to read books' }, { status: 500 });
  }
}

// POST /api/books - Save a book
export async function POST(request: Request) {
  try {
    const book = await request.json();
    await initializeStorage();
    
    const content = await fs.readFile(BOOKS_FILE, 'utf-8');
    const data = JSON.parse(content);
    const books = data.books || [];
    
    const existingIndex = books.findIndex((b: any) => b.isbn === book.isbn);
    if (existingIndex >= 0) {
      books[existingIndex] = book;
    } else {
      books.push(book);
    }
    
    await fs.writeFile(BOOKS_FILE, JSON.stringify({ books }, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving book:', error);
    return NextResponse.json({ error: 'Failed to save book' }, { status: 500 });
  }
}