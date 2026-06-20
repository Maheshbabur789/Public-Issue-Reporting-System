package com.mahesh.ReportingSystem.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahesh.ReportingSystem.Entity.Complaint;
import com.mahesh.ReportingSystem.Entity.User;
import com.mahesh.ReportingSystem.Repository.ComplaintRepository;
import com.mahesh.ReportingSystem.Repository.UserRepository;

@Service
public class ComplaintService {


@Autowired
private ComplaintRepository complaintRepository;

@Autowired
private UserRepository userRepository;

public Complaint addComplaint(Complaint complaint, Long userId) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    complaint.setUser(user);

    // Auto complaint number
    String complaintNumber =
            "CMP-" + System.currentTimeMillis();

    complaint.setComplaintNumber(complaintNumber);

    // Default values
    complaint.setStatus("PENDING");

    if (complaint.getPriority() == null ||
        complaint.getPriority().isBlank()) {

        complaint.setPriority("MEDIUM");
    }

    complaint.setCreatedAt(LocalDateTime.now());
    complaint.setUpdatedAt(LocalDateTime.now());

    return complaintRepository.save(complaint);
}

public List<Complaint> getAllComplaints() {
    return complaintRepository.findAll();
}

public Complaint getComplaintById(Long id) {

    return complaintRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Complaint not found"));
}

public Complaint updateStatus(Long id, String status) {

    Complaint complaint =
            complaintRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Complaint not found"));

    complaint.setStatus(status);
    complaint.setUpdatedAt(LocalDateTime.now());

    if ("RESOLVED".equalsIgnoreCase(status)) {
        complaint.setResolvedAt(LocalDateTime.now());
    }

    return complaintRepository.save(complaint);
}

public List<Complaint> getByUserId(Long userId) {
    return complaintRepository.findByUserId(userId);
}

public void deleteComplaint(Long id) {
    complaintRepository.deleteById(id);
}

public long getPendingCount() {
    return complaintRepository.countByStatus("PENDING");
}

public long getResolvedCount() {
    return complaintRepository.countByStatus("RESOLVED");
}

public long getInProgressCount() {
    return complaintRepository.countByStatus("IN_PROGRESS");
}


}
