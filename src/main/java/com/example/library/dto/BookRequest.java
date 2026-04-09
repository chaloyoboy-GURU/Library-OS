package com.example.library.dto;

public record BookRequest(
        String title,
        String author,
        String isbn,
        String publisher,
        Integer publicationYear,
        String category,
        Integer totalCopies,
        String imageUrl
) {
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getIsbn() { return isbn; }
    public String getPublisher() { return publisher; }
    public Integer getPublicationYear() { return publicationYear; }
    public String getCategory() { return category; }
    public Integer getTotalCopies() { return totalCopies; }
    public String getImageUrl() { return imageUrl; }
}