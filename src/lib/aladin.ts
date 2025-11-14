// Types for Aladin API response
export interface AladinBook {
  title: string;
  author: string;
  isbn: string;
  cover: string;
  publisher: string;
  pubDate: string;
  description: string;
  itemPage: number;
}

// Function to search books using Aladin API through our API route
export async function searchBooks(query: string): Promise<AladinBook[]> {
  try {
    console.log('Searching for:', query);
    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    // search/route.ts에 액세스해서 api를 호출하도록 함.
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json(); // return값
    console.log('Search response:', data);
    
    if (!data.item || !Array.isArray(data.item)) {
      console.error('Unexpected API response format:', data);
      return [];
    }
    
    return data.item.map((item: any) => ({
      title: item.title,
      author: item.author,
      isbn: item.isbn13 || item.isbn,
      cover: item.cover,
      publisher: item.publisher,
      pubDate: item.pubDate,
      description: item.description,
      //totalPages: item.subInfo?.itemPage || 0
    }));
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}

// Function to search books using Aladin API through our API route
export async function getPages(query: string): Promise<AladinBook[]> {
  try {
    console.log('Getting pages for:', query);
    const response = await fetch(`/api/pages?query=${encodeURIComponent(query)}`);
    // pages/route.ts에 액세스해서 api를 호출하도록 함.
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json(); // return값
    console.log('Search response:', data);
    
    if (!data.item || !Array.isArray(data.item)) {
      console.error('Unexpected API response format:', data);
      return [];
    }
    
    return data.item.map((item: any) => ({
      isbn: item.isbn13, // only gets isbn13 in pages/route.ts
      itemPage: item.subInfo.itemPage || 0 // 0이어도 되냐..?
    }));
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}

// Types for our book storage
export interface SavedBook extends AladinBook {
  status: 'want-to-read' | 'reading' | 'completed';
  currentPage: number;
  totalPages: number;
  startDate?: string;
  completedDate?: string;
  addedDate?: string;
  notes?: string;
}

// API-based storage functions
export async function getSavedBooks(): Promise<SavedBook[]> {
  try {
    const response = await fetch('/api/books');
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading books:', error);
    return [];
  }
}

export async function saveBook(book: SavedBook): Promise<void> {
  try {
    console.log('Saving book:', book);
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book), // if wanting to delete the book, book should be empty object.
    });
    
    if (!response.ok) {
      throw new Error('Failed to save book');
    }
  } catch (error) {
    console.error('Error saving book:', error);
    throw error;
  }
}