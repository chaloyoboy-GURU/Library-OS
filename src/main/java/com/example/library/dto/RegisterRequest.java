package com.example.library.dto;

public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        String role
) {
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
}