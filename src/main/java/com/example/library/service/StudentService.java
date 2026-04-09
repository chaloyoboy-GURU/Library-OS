package com.example.library.service;

import com.example.library.entity.Student;
import com.example.library.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    // Constructor injection (replaces @RequiredArgsConstructor)
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Register a new student
     */
    public Student registerStudent(Student student) {
        // Check if email already exists
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        return studentRepository.save(student);
    }

    /**
     * Find student by email
     */
    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
}