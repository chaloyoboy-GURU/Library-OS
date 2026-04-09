package com.example.library.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_records")
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;

    private String notes;

    @Enumerated(EnumType.STRING)
    private BorrowStatus status;

    public enum BorrowStatus {
        BORROWED,
        RETURNED
    }

    // Constructors
    public BorrowRecord() {
    }

    public BorrowRecord(Long id, Student student, Book book, LocalDateTime borrowDate,
                        LocalDateTime dueDate, LocalDateTime returnDate, String notes, BorrowStatus status) {
        this.id = id;
        this.student = student;
        this.book = book;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.notes = notes;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public BorrowStatus getStatus() {
        return status;
    }

    public void setStatus(BorrowStatus status) {
        this.status = status;
    }

    // Helper methods
    public void markAsReturned() {
        this.status = BorrowStatus.RETURNED;
        this.returnDate = LocalDateTime.now();
    }

    public boolean isOverdue() {
        if (status == BorrowStatus.RETURNED) {
            return false;
        }
        return dueDate != null && LocalDateTime.now().isAfter(dueDate);
    }

    // Builder pattern
    public static BorrowRecordBuilder builder() {
        return new BorrowRecordBuilder();
    }

    public static class BorrowRecordBuilder {
        private Long id;
        private Student student;
        private Book book;
        private LocalDateTime borrowDate;
        private LocalDateTime dueDate;
        private LocalDateTime returnDate;
        private String notes;
        private BorrowStatus status;

        public BorrowRecordBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BorrowRecordBuilder student(Student student) {
            this.student = student;
            return this;
        }

        public BorrowRecordBuilder book(Book book) {
            this.book = book;
            return this;
        }

        public BorrowRecordBuilder borrowDate(LocalDateTime borrowDate) {
            this.borrowDate = borrowDate;
            return this;
        }

        public BorrowRecordBuilder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public BorrowRecordBuilder returnDate(LocalDateTime returnDate) {
            this.returnDate = returnDate;
            return this;
        }

        public BorrowRecordBuilder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public BorrowRecordBuilder status(BorrowStatus status) {
            this.status = status;
            return this;
        }

        public BorrowRecord build() {
            return new BorrowRecord(id, student, book, borrowDate, dueDate, returnDate, notes, status);
        }
    }
}