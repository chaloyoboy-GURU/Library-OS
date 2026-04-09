package com.example.library.service;

import com.example.library.dto.BorrowRecordResponse;
import com.example.library.dto.BorrowRequest;
import com.example.library.entity.Book;
import com.example.library.entity.BorrowRecord;
import com.example.library.entity.BorrowRecord.BorrowStatus;
import com.example.library.entity.Student;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowRecordRepository;
import com.example.library.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final StudentRepository studentRepository;

    private static final int MAX_BOOKS_PER_STUDENT = 5;

    // Constructor injection (replaces @RequiredArgsConstructor)
    public BorrowService(BorrowRecordRepository borrowRecordRepository,
                         BookRepository bookRepository,
                         StudentRepository studentRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.studentRepository = studentRepository;
    }

    public BorrowRecordResponse borrowBook(Long studentId, BorrowRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + request.getBookId()));

        if (!book.isAvailable()) {
            throw new IllegalStateException("Book is not available for borrowing");
        }

        Long currentBorrows = borrowRecordRepository.countByStudentIdAndStatus(studentId, BorrowStatus.BORROWED);
        if (currentBorrows >= MAX_BOOKS_PER_STUDENT) {
            throw new IllegalStateException("You have reached the maximum limit of " + MAX_BOOKS_PER_STUDENT + " borrowed books");
        }

        if (borrowRecordRepository.findByStudentIdAndBookIdAndStatus(studentId, request.getBookId(), BorrowStatus.BORROWED).isPresent()) {
            throw new IllegalStateException("You have already borrowed this book");
        }

        LocalDateTime now = LocalDateTime.now();
        int durationDays = request.getDurationDays() != null ? request.getDurationDays() : 14;

        BorrowRecord borrowRecord = BorrowRecord.builder()
                .student(student)
                .book(book)
                .borrowDate(now)
                .dueDate(now.plusDays(durationDays))
                .status(BorrowStatus.BORROWED)
                .build();

        book.borrowBook();

        bookRepository.save(book);
        BorrowRecord savedRecord = borrowRecordRepository.save(borrowRecord);

        return convertToResponse(savedRecord);
    }

    public BorrowRecordResponse returnBook(Long borrowRecordId, String notes) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(borrowRecordId)
                .orElseThrow(() -> new IllegalArgumentException("Borrow record not found with id: " + borrowRecordId));

        if (borrowRecord.getStatus() == BorrowStatus.RETURNED) {
            throw new IllegalStateException("This book has already been returned");
        }

        borrowRecord.markAsReturned();
        if (notes != null) {
            borrowRecord.setNotes(notes);
        }

        Book book = borrowRecord.getBook();
        book.returnBook();

        bookRepository.save(book);
        BorrowRecord updatedRecord = borrowRecordRepository.save(borrowRecord);

        return convertToResponse(updatedRecord);
    }

    public List<BorrowRecordResponse> getStudentBorrowHistory(Long studentId) {
        return borrowRecordRepository.findByStudentId(studentId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BorrowRecordResponse> getCurrentBorrows(Long studentId) {
        return borrowRecordRepository.findByStudentIdAndStatus(studentId, BorrowStatus.BORROWED)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BorrowRecordResponse> getOverdueBooks() {
        return borrowRecordRepository.findByStatusAndDueDateBefore(BorrowStatus.BORROWED, LocalDateTime.now())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BorrowRecordResponse renewBook(Long borrowRecordId, Integer additionalDays) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(borrowRecordId)
                .orElseThrow(() -> new IllegalArgumentException("Borrow record not found"));

        if (borrowRecord.getStatus() != BorrowStatus.BORROWED) {
            throw new IllegalStateException("Can only renew currently borrowed books");
        }

        int days = additionalDays != null ? additionalDays : 14;
        borrowRecord.setDueDate(borrowRecord.getDueDate().plusDays(days));

        BorrowRecord updated = borrowRecordRepository.save(borrowRecord);
        return convertToResponse(updated);
    }

    private BorrowRecordResponse convertToResponse(BorrowRecord record) {
        return BorrowRecordResponse.builder()
                .id(record.getId())
                .studentId(record.getStudent().getId())
                .studentName(record.getStudent().getFirstName() + " " + record.getStudent().getLastName())
                .bookId(record.getBook().getId())
                .bookTitle(record.getBook().getTitle())
                .borrowDate(record.getBorrowDate())
                .dueDate(record.getDueDate())
                .returnDate(record.getReturnDate())
                .status(record.getStatus().name())
                .isOverdue(record.isOverdue())
                .notes(record.getNotes())
                .build();
    }
}