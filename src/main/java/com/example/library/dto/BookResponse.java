package com.example.library.dto;

public record BookResponse(
        Long id,
        String title,
        String author,
        String isbn,
        String publisher,
        Integer publicationYear,
        String category,
        Integer totalCopies,
        Integer availableCopies,
        boolean isAvailable,
        String imageUrl
) {
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getIsbn() { return isbn; }
    public String getPublisher() { return publisher; }
    public Integer getPublicationYear() { return publicationYear; }
    public String getCategory() { return category; }
    public Integer getTotalCopies() { return totalCopies; }
    public Integer getAvailableCopies() { return availableCopies; }
    public boolean isAvailable() { return isAvailable; }
    public String getImageUrl() { return imageUrl; }
}