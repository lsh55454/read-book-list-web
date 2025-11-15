'use client';

import { useState, useEffect, useRef } from 'react';
import { searchBooks, getPages, type AladinBook, type SavedBook, saveBook, getSavedBooks } from '@/lib/aladin';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AladinBook[]>([]);
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadBooks = async () => {
      const books = await getSavedBooks();
      setSavedBooks(books);
    };
    loadBooks();
  }, []);


  const handleSearch = async () => {
    console.log('Search button clicked');
    if (!searchQuery.trim()) return;
    console.log('Searching for:', searchQuery);
    try {
      const results = await searchBooks(searchQuery);
      console.log('Search results:', results); // searchBooks의 결과 => results

      const resultsIsbns = results.map(r => r.isbn); // isbn 배열 생성
      const promises = resultsIsbns.map(isbn => getPages(isbn)); // 각 isbn에 대해 getPages 호출
      const pagesResults = await Promise.all(promises);
      console.log('Pages results:', pagesResults);
      
      results.forEach((book, index) => {
        book.itemPage = pagesResults[index][0]?.itemPage || 0; // 각 책에 페이지 정보 추가
      });
      
      setSearchResults(results);
      setIsResultsVisible(true); // 검색 결과 패널 보이기
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSaveBook = async (book: AladinBook) => {
    try {
      const newBook: SavedBook = {
        ...book,
        status: 'completed',
        addedDate: new Date().toISOString(),
        currentPage: 0,
        totalPages: book.itemPage || 0
      };
      await saveBook(newBook);
      const updatedBooks = await getSavedBooks();
      setSavedBooks(updatedBooks);
    } catch (error) {
      console.error('Save book error:', error);
    }
    finally {
      setIsResultsVisible(false); // 저장 후 검색 결과 패널 숨기기
    }
  };

  const handleDeleteBook = async (book: AladinBook) => {
    const postingDeleteBook: SavedBook = {
      ...book,
      title: "",
      status: 'completed',
      currentPage: 0,
      totalPages: 0,
    };
    await saveBook(postingDeleteBook); // title이 빈 책을 저장하여 삭제 트리거
    const updatedBooks = await getSavedBooks();
    setSavedBooks(updatedBooks);
  };

  const handleToggleStatus = async (book: SavedBook) => {
    const updatedBook: SavedBook = {
      ...book,
      status: book.status === 'want-to-read' ? 'completed' : 'want-to-read',
      completedDate: book.status === 'want-to-read' ? new Date().toISOString() : undefined
    };
    await saveBook(updatedBook);
    const updatedBooks = await getSavedBooks();
    setSavedBooks(updatedBooks);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex max-w-7xl mx-auto px-4 py-4">
          {/*홈으로 돌아가기*/}
          <Link href="/" className="flex items-center">
          {/*logo and title*/}
          <img src="favicon.ico" alt="Logo" className="h-8 mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">&nbsp;&nbsp;나의 독서 기록</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)] bg-white text-gray-900">
        {/* Left Side - Search Section */}
        <div className="hidden md:block w-1/2 p-6 border-r overflow-y-auto">
          <div className="sticky top-0 bg-white pb-4 z-10">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="책 제목을 입력하세요..."
                className="flex-1 p-2 border rounded text-gray-900"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                검색
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="mt-6">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((book) => (
                  <div key={book.isbn} className="flex border rounded-lg p-4 gap-4">
                    <img src={book.cover} alt={book.title} className="w-24 h-auto object-cover" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                      <p className="text-sm text-gray-500 mt-1">{book.publisher} ({book.pubDate})</p>
                      <p className="text-sm text-gray-500 mt-1">{book.itemPage}페이지</p>
                      <button
                        onClick={() => handleSaveBook(book)}
                        className="mt-3 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        읽은 책에 추가
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <p className="text-center text-gray-500 mt-8">검색 결과가 없습니다</p>
            ) : null}
          </div>
        </div>

        {/* Right Side - Saved Books */}
        <div className="md:w-1/2 p-6 bg-gray-50 overflow-y-auto">
          {/* Search Bar for smaller screens */}
          <div className="md:hidden sticky top-0 bg-white pb-4 z-10">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="책 제목을 입력하세요..."
                className="flex-1 p-2 border rounded text-gray-900"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                ref={searchInputRef}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                검색
              </button>
            </div>
          </div>

          {/* Search Results in smaller screen */}
          {isResultsVisible && (
            <div className="
            md:hidden
          ">
              <div
                className="mt-6 space-y-4 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 150px)' }}
                onScroll={() => {
                // 패널 내부를 스크롤(슬라이드다운)하면 키보드 숨기기
                searchInputRef.current?.blur();
              }}
              >
                {searchResults.length > 0 ? (
                searchResults.map((book) => (
                  <div key={book.isbn} className="flex border rounded-lg p-4 gap-4">
                    <img src={book.cover} alt={book.title} className="w-24 h-auto object-cover" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                      <p className="text-sm text-gray-500 mt-1">{book.publisher} ({book.pubDate})</p>
                      <p className="text-sm text-gray-500 mt-1">{book.itemPage}페이지</p>
                      <button
                        onClick={() => handleSaveBook(book)}
                        className="mt-3 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        읽은 책에 추가
                      </button>
                    </div>
                  </div>
                ))
            ) : searchQuery ? (
              <p className="text-center text-gray-500 mt-8">검색 결과가 없습니다</p>
            ) : null}
          </div>
          </div>
          )}

          {/* Saved Books Summary (common) */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">내 서재</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-900">총 읽은 책</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {savedBooks.filter(b => b.status === 'completed').length}권
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-900">총 읽은 페이지 수</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {savedBooks
                    .filter(b => b.status === 'completed')
                    .reduce((sum, book) => sum + book.totalPages, 0)
                    .toLocaleString()}p
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {savedBooks.map((book) => (
              <div key={book.isbn} className="flex bg-white border rounded-lg p-4 gap-4">
                <img src={book.cover} alt={book.title} className="w-24 h-auto object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{book.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                  <p className="text-sm text-gray-500 mt-1">{book.publisher}</p>
                  <p className="text-sm text-gray-400">{book.totalPages}페이지</p>
                  <div className="mt-3">
                    <button
                      onClick={() => handleToggleStatus(book)}
                      className={`text-sm px-3 py-1 rounded ${
                        book.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {book.status === 'completed' ? '✓ 읽음' : '읽고 싶은 책'}
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book)}
                      className="ml-2 text-sm px-3 py-1 bg-red-100 text-red-500 rounded hover:bg-red-300"
                      >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {savedBooks.length === 0 && (
              <p className="text-center text-gray-500">아직 저장된 책이 없습니다</p>
            )}
          </div>
          {/* --- 👇 [새로 추가] 플로팅 검색 닫기 버튼 --- */}
        {isResultsVisible && (
          <button
            onClick={() => setIsResultsVisible(false)}
            className="
              md:hidden
              fixed z-20 bottom-10 right-6
              bg-blue-500 text-white ${/* 3. 버튼 색상 */''}
              w-22 h-10 rounded-full
              flex items-center justify-center ${/* 5. 아이콘 중앙 정렬 */''}
              shadow-lg ${/* 6. 떠있는 그림자 효과 */''}
            "
            aria-label="검색 닫기"
          >
            {/* 간단한 X 아이콘 (SVG) */}
            검색 닫기
          </button>
        )}
        
        </div>
      </div>
    </div>
  );
}
