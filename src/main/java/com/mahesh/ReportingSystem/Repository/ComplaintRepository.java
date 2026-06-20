package com.mahesh.ReportingSystem.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mahesh.ReportingSystem.Entity.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {


// User complaints
List<Complaint> findByUserId(Long userId);

// Track by complaint number
Complaint findByComplaintNumber(String complaintNumber);

// Filter by status
List<Complaint> findByStatus(String status);

// Filter by category
List<Complaint> findByCategory(String category);

// Filter by priority
List<Complaint> findByPriority(String priority);

// Admin dashboard
long countByStatus(String status);

long countByCategory(String category);


}
