package com.example.library.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phoneNumber;
    private String studentId;

    // THIS IS THE IMPORTANT PART - ROLE FIELD
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.STUDENT;

    // Constructors
    public Student() {
    }

    public Student(Long id, String firstName, String lastName, String email,
                   String password, String phoneNumber, String studentId, Role role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.studentId = studentId;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    // Helper methods
    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

    public boolean isLibrarian() {
        return this.role == Role.LIBRARIAN;
    }

    // Builder pattern
    public static StudentBuilder builder() {
        return new StudentBuilder();
    }

    public static class StudentBuilder {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String phoneNumber;
        private String studentId;
        private Role role = Role.STUDENT;

        public StudentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public StudentBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public StudentBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public StudentBuilder email(String email) {
            this.email = email;
            return this;
        }

        public StudentBuilder password(String password) {
            this.password = password;
            return this;
        }

        public StudentBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public StudentBuilder studentId(String studentId) {
            this.studentId = studentId;
            return this;
        }

        public StudentBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public Student build() {
            return new Student(id, firstName, lastName, email, password, phoneNumber, studentId, role);
        }
    }
}