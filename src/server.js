const express = require('express');
const { nanoid } = require('nanoid');

const app = express();
const port = 9000; 

app.use(express.json());

let books = [];

// Menambahkan Buku
app.post('/books', (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
});

// Menampilkan semua buku
app.get('/books', (req, res) => {
  const bookData = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return res.status(200).json({
    status: 'success',
    data: {
      books: bookData,
    },
  });
});

// Menampilkan Buku dengan ID
app.get('/books/:bookId', (req, res) => {
    const { bookId } = req.params;

    if (!bookId || typeof bookId !== 'string') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid book ID. Please provide a valid bookId.',
      });
    }
  
    const book = books.find((book) => book.id === bookId);
  
    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
    }
  
    return res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  });
  
// Update Dengan ID
app.put('/books/:bookId', (req, res) => {
  const { bookId } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
});

// Menghapus dengan ID
app.delete('/books/:bookId', (req, res) => {
  const { bookId } = req.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(bookIndex, 1);

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
});

// Memulai Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
