package com.example.library.controller;

import com.example.library.dto.BorrowRecordResponse;
import com.example.library.dto.BorrowRequest;
import com.example.library.service.BorrowService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrows")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping("/borrow/{studentId}")
    public ResponseEntity<BorrowRecordResponse> borrowBook(
            @PathVariable Long studentId,
            @RequestBody BorrowRequest request) {
        BorrowRecordResponse response = borrowService.borrowBook(studentId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/return/{borrowRecordId}")
    public ResponseEntity<BorrowRecordResponse> returnBook(
            @PathVariable Long borrowRecordId,
            @RequestParam(required = false) String notes) {
        BorrowRecordResponse response = borrowService.returnBook(borrowRecordId, notes);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<BorrowRecordResponse>> getStudentBorrowHistory(
            @PathVariable Long studentId) {
        List<BorrowRecordResponse> history = borrowService.getStudentBorrowHistory(studentId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/student/{studentId}/current")
    public ResponseEntity<List<BorrowRecordResponse>> getCurrentBorrows(
            @PathVariable Long studentId) {
        List<BorrowRecordResponse> current = borrowService.getCurrentBorrows(studentId);
        return ResponseEntity.ok(current);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<BorrowRecordResponse>> getOverdueBooks() {
        List<BorrowRecordResponse> overdue = borrowService.getOverdueBooks();
        return ResponseEntity.ok(overdue);
    }

    @PutMapping("/renew/{borrowRecordId}")
    public ResponseEntity<BorrowRecordResponse> renewBook(
            @PathVariable Long borrowRecordId,
            @RequestParam(required = false) Integer additionalDays) {
        BorrowRecordResponse response = borrowService.renewBook(borrowRecordId, additionalDays);
        return ResponseEntity.ok(response);
    }
}