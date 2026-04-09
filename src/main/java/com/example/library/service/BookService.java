package com.example.library.service;

import com.example.library.dto.BookRequest;
import com.example.library.dto.BookResponse;
import com.example.library.entity.Book;
import com.example.library.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public BookResponse createBook(BookRequest request) {
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .publisher(request.getPublisher())
                .publicationYear(request.getPublicationYear())
                .category(request.getCategory())
                .totalCopies(request.getTotalCopies())
                .availableCopies(request.getTotalCopies())
                .imageUrl(request.getImageUrl())
                .build();

        Book savedBook = bookRepository.save(book);
        return convertToResponse(savedBook);
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        return convertToResponse(book);
    }

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setPublisher(request.getPublisher());
        book.setPublicationYear(request.getPublicationYear());
        book.setCategory(request.getCategory());
        book.setTotalCopies(request.getTotalCopies());
        book.setImageUrl(request.getImageUrl());

        Book updatedBook = bookRepository.save(book);
        return convertToResponse(updatedBook);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    private BookResponse convertToResponse(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getPublisher(),
                book.getPublicationYear(),
                book.getCategory(),
                book.getTotalCopies(),
                book.getAvailableCopies(),
                book.isAvailable(),
                book.getImageUrl()
        );
    }
}