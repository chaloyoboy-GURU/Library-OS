package com.example.library.dto;

public record BorrowRequest(
        Long bookId,
        Integer durationDays
) {
    // Compatibility getters for backward compatibility
    public Long getBookId() {
        return bookId;
    }

    public Integer getDurationDays() {
        return durationDays;
    }
}