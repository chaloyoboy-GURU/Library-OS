package com.example.library.dto;

import java.time.LocalDateTime;

public class BorrowRecordResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long bookId;
    private String bookTitle;
    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private String status;
    private boolean isOverdue;
    private String notes;

    // Constructors
    public BorrowRecordResponse() {
    }

    public BorrowRecordResponse(Long id, Long studentId, String studentName, Long bookId,
                                String bookTitle, LocalDateTime borrowDate, LocalDateTime dueDate,
                                LocalDateTime returnDate, String status, boolean isOverdue, String notes) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
        this.isOverdue = isOverdue;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public LocalDateTime getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(LocalDateTime borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDateTime returnDate) {
        this.returnDate = returnDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isOverdue() {
        return isOverdue;
    }

    public void setOverdue(boolean overdue) {
        isOverdue = overdue;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Builder pattern
    public static BorrowRecordResponseBuilder builder() {
        return new BorrowRecordResponseBuilder();
    }

    public static class BorrowRecordResponseBuilder {
        private Long id;
        private Long studentId;
        private String studentName;
        private Long bookId;
        private String bookTitle;
        private LocalDateTime borrowDate;
        private LocalDateTime dueDate;
        private LocalDateTime returnDate;
        private String status;
        private boolean isOverdue;
        private String notes;

        public BorrowRecordResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BorrowRecordResponseBuilder studentId(Long studentId) {
            this.studentId = studentId;
            return this;
        }

        public BorrowRecordResponseBuilder studentName(String studentName) {
            this.studentName = studentName;
            return this;
        }

        public BorrowRecordResponseBuilder bookId(Long bookId) {
            this.bookId = bookId;
            return this;
        }

        public BorrowRecordResponseBuilder bookTitle(String bookTitle) {
            this.bookTitle = bookTitle;
            return this;
        }

        public BorrowRecordResponseBuilder borrowDate(LocalDateTime borrowDate) {
            this.borrowDate = borrowDate;
            return this;
        }

        public BorrowRecordResponseBuilder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public BorrowRecordResponseBuilder returnDate(LocalDateTime returnDate) {
            this.returnDate = returnDate;
            return this;
        }

        public BorrowRecordResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public BorrowRecordResponseBuilder isOverdue(boolean isOverdue) {
            this.isOverdue = isOverdue;
            return this;
        }

        public BorrowRecordResponseBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public BorrowRecordResponse build() {
            return new BorrowRecordResponse(id, studentId, studentName, bookId, bookTitle,
                    borrowDate, dueDate, returnDate, status, isOverdue, notes);
        }
    }
}