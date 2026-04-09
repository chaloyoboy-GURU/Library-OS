package com.example.library.dto;

public record ReturnRequest(
        Long borrowRecordId,
        String notes
) {
    public Long getBorrowRecordId() { return borrowRecordId; }
    public String getNotes() { return notes; }
}