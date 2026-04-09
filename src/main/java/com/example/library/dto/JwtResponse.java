package com.example.library.dto;

public record JwtResponse(
        String token,
        String type,
        Long id,
        String email,
        String firstName,
        String lastName,
        String role
) {
    public String getToken() { return token; }
    public String getType() { return type; }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getRole() { return role; }
}