package com.mahesh.ReportingSystem.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String name;

@Column(unique = true)
private String email;

@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private String password;

private String role;

// OTP Fields

@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private String otp;

@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
private Long otpExpiry;

public User() {
}

public User(Long id,
            String name,
            String email,
            String password,
            String role,
            String otp,
            Long otpExpiry) {

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.otp = otp;
    this.otpExpiry = otpExpiry;
}

// Getters

public Long getId() {
    return id;
}

public String getName() {
    return name;
}

public String getEmail() {
    return email;
}

public String getPassword() {
    return password;
}

public String getRole() {
    return role;
}

public String getOtp() {
    return otp;
}

public Long getOtpExpiry() {
    return otpExpiry;
}

// Setters

public void setId(Long id) {
    this.id = id;
}

public void setName(String name) {
    this.name = name;
}

public void setEmail(String email) {
    this.email = email;
}

public void setPassword(String password) {
    this.password = password;
}

public void setRole(String role) {
    this.role = role;
}

public void setOtp(String otp) {
    this.otp = otp;
}

public void setOtpExpiry(Long otpExpiry) {
    this.otpExpiry = otpExpiry;
}


}
