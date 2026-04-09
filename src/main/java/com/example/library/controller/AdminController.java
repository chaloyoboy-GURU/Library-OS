package com.example.library.controller;

import com.example.library.entity.Student;
import com.example.library.entity.Role;
import com.example.library.repository.StudentRepository;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final StudentRepository studentRepository;
    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public AdminController(StudentRepository studentRepository,
                           BookRepository bookRepository,
                           BorrowRecordRepository borrowRecordRepository) {
        this.studentRepository = studentRepository;
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<Student>> getAllUsers() {
        List<Student> users = studentRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Student> getUserById(@PathVariable Long id) {
        Student user = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Student> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role) {
        Student user = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);
        Student updatedUser = studentRepository.save(user);

        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", studentRepository.count());
        stats.put("totalBooks", bookRepository.count());
        stats.put("totalBorrows", borrowRecordRepository.count());
        stats.put("availableBooks", bookRepository.findByAvailableCopiesGreaterThan(0).size());

        long students = studentRepository.findAll().stream()
                .filter(s -> s.getRole() == Role.STUDENT)
                .count();
        long admins = studentRepository.findAll().stream()
                .filter(s -> s.getRole() == Role.ADMIN)
                .count();
        long librarians = studentRepository.findAll().stream()
                .filter(s -> s.getRole() == Role.LIBRARIAN)
                .count();

        stats.put("students", students);
        stats.put("admins", admins);
        stats.put("librarians", librarians);

        return ResponseEntity.ok(stats);
    }
}