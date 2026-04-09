package com.example.library.repository;

import com.example.library.entity.BorrowRecord;
import com.example.library.entity.BorrowRecord.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByStudentId(Long studentId);

    List<BorrowRecord> findByStudentIdAndStatus(Long studentId, BorrowStatus status);

    Long countByStudentIdAndStatus(Long studentId, BorrowStatus status);

    Optional<BorrowRecord> findByStudentIdAndBookIdAndStatus(Long studentId, Long bookId, BorrowStatus status);

    List<BorrowRecord> findByStatusAndDueDateBefore(BorrowStatus status, LocalDateTime dueDate);

    List<BorrowRecord> findByBookId(Long bookId);
}