package com.example.library.controller;

import com.example.library.entity.Student;
import com.example.library.entity.Role;
import com.example.library.repository.StudentRepository;
import com.example.library.dto.RegisterRequest;
import com.example.library.dto.LoginRequest;
import com.example.library.dto.JwtResponse;
import com.example.library.util.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthController(StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (studentRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Error: Email is already in use!");
            }

            Role role = Role.STUDENT;
            if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
                role = Role.ADMIN;
            } else if (request.getRole() != null && request.getRole().equalsIgnoreCase("LIBRARIAN")) {
                role = Role.LIBRARIAN;
            }

            Student student = Student.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(role)
                    .build();

            studentRepository.save(student);

            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            System.err.println("Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for email: " + request.getEmail());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            System.out.println("Authentication successful!");

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String jwt = jwtUtils.generateToken(userDetails);

            Student student = studentRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            JwtResponse response = new JwtResponse(
                    jwt,
                    "Bearer",
                    student.getId(),
                    student.getEmail(),
                    student.getFirstName(),
                    student.getLastName(),
                    student.getRole().name()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Login failed: " + e.getClass().getName());
            System.err.println("Error message: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Error: Invalid email or password");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return ResponseEntity.ok(student);
    }
}