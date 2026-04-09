package com.example.library.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(nullable = false)
    private String author;

    @Column(unique = true, nullable = false)
    private String isbn;

    private String publisher;

    @Column(name = "publication_year")
    private Integer publicationYear;

    private String category;

    @Column(name = "total_copies")
    private Integer totalCopies;

    @Column(name = "available_copies")
    private Integer availableCopies;

    public Book() {}

    public Book(Long id, String title, String author, String isbn, String publisher,
                Integer publicationYear, String category, Integer totalCopies,
                Integer availableCopies, String imageUrl) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publisher = publisher;
        this.publicationYear = publicationYear;
        this.category = category;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public Integer getPublicationYear() { return publicationYear; }
    public void setPublicationYear(Integer publicationYear) { this.publicationYear = publicationYear; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getTotalCopies() { return totalCopies; }
    public void setTotalCopies(Integer totalCopies) { this.totalCopies = totalCopies; }

    public Integer getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(Integer availableCopies) { this.availableCopies = availableCopies; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() {
        return availableCopies != null && availableCopies > 0;
    }

    public void borrowBook() {
        if (isAvailable()) {
            this.availableCopies--;
        } else {
            throw new IllegalStateException("No copies available for borrowing");
        }
    }

    public void returnBook() {
        if (this.availableCopies < this.totalCopies) {
            this.availableCopies++;
        } else {
            throw new IllegalStateException("All copies are already returned");
        }
    }

    public static BookBuilder builder() { return new BookBuilder(); }

    public static class BookBuilder {
        private Long id;
        private String title;
        private String author;
        private String isbn;
        private String publisher;
        private Integer publicationYear;
        private String category;
        private Integer totalCopies;
        private Integer availableCopies;
        private String imageUrl;

        public BookBuilder id(Long id) { this.id = id; return this; }
        public BookBuilder title(String title) { this.title = title; return this; }
        public BookBuilder author(String author) { this.author = author; return this; }
        public BookBuilder isbn(String isbn) { this.isbn = isbn; return this; }
        public BookBuilder publisher(String publisher) { this.publisher = publisher; return this; }
        public BookBuilder publicationYear(Integer publicationYear) { this.publicationYear = publicationYear; return this; }
        public BookBuilder category(String category) { this.category = category; return this; }
        public BookBuilder totalCopies(Integer totalCopies) { this.totalCopies = totalCopies; return this; }
        public BookBuilder availableCopies(Integer availableCopies) { this.availableCopies = availableCopies; return this; }
        public BookBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

        public Book build() {
            return new Book(id, title, author, isbn, publisher, publicationYear,
                    category, totalCopies, availableCopies, imageUrl);
        }
    }
}