package com.mahesh.ReportingSystem.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "complaint")
public class Complaint {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(unique = true)
private String complaintNumber;

private String title;

@Column(length = 2000)
private String description;

private String category;

private String location;

private String landmark;

private String priority;

private String department;

private String mobileNumber;

private String imageUrl;

private String status;

private String assignedTo;

@Column(length = 1000)
private String adminRemarks;

@Column(length = 1000)
private String resolutionNote;

private LocalDateTime createdAt;

private LocalDateTime updatedAt;

private LocalDateTime resolvedAt;

@ManyToOne
@JoinColumn(name = "user_id")
@JsonIgnoreProperties({"password","otp","otpExpiry"})
private User user;

public Complaint() {
}

// Getters and Setters

public Long getId() {
    return id;
}

public String getComplaintNumber() {
    return complaintNumber;
}

public String getTitle() {
    return title;
}

public String getDescription() {
    return description;
}

public String getCategory() {
    return category;
}

public String getLocation() {
    return location;
}

public String getLandmark() {
    return landmark;
}

public String getPriority() {
    return priority;
}

public String getDepartment() {
    return department;
}

public String getMobileNumber() {
    return mobileNumber;
}

public String getImageUrl() {
    return imageUrl;
}

public String getStatus() {
    return status;
}

public String getAssignedTo() {
    return assignedTo;
}

public String getAdminRemarks() {
    return adminRemarks;
}

public String getResolutionNote() {
    return resolutionNote;
}

public LocalDateTime getCreatedAt() {
    return createdAt;
}

public LocalDateTime getUpdatedAt() {
    return updatedAt;
}

public LocalDateTime getResolvedAt() {
    return resolvedAt;
}

public User getUser() {
    return user;
}

public void setId(Long id) {
    this.id = id;
}

public void setComplaintNumber(String complaintNumber) {
    this.complaintNumber = complaintNumber;
}

public void setTitle(String title) {
    this.title = title;
}

public void setDescription(String description) {
    this.description = description;
}

public void setCategory(String category) {
    this.category = category;
}

public void setLocation(String location) {
    this.location = location;
}

public void setLandmark(String landmark) {
    this.landmark = landmark;
}

public void setPriority(String priority) {
    this.priority = priority;
}

public void setDepartment(String department) {
    this.department = department;
}

public void setMobileNumber(String mobileNumber) {
    this.mobileNumber = mobileNumber;
}

public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
}

public void setStatus(String status) {
    this.status = status;
}

public void setAssignedTo(String assignedTo) {
    this.assignedTo = assignedTo;
}

public void setAdminRemarks(String adminRemarks) {
    this.adminRemarks = adminRemarks;
}

public void setResolutionNote(String resolutionNote) {
    this.resolutionNote = resolutionNote;
}

public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}

public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
}

public void setResolvedAt(LocalDateTime resolvedAt) {
    this.resolvedAt = resolvedAt;
}

public void setUser(User user) {
    this.user = user;
}


}
