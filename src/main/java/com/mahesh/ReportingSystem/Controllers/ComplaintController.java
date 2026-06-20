package com.mahesh.ReportingSystem.Controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mahesh.ReportingSystem.Entity.Complaint;
import com.mahesh.ReportingSystem.Service.ComplaintService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {


@Autowired
private ComplaintService complaintService;

// Submit Complaint
@PostMapping("/{userId}")
public Complaint addComplaint(
        @Valid @RequestBody Complaint complaint,
        @PathVariable("userId") Long userId) {

    return complaintService.addComplaint(complaint, userId);
}

// Get All Complaints
@GetMapping
public List<Complaint> getAllComplaints() {
    return complaintService.getAllComplaints();
}

// Get Complaint By Id
@GetMapping("/{id}")
public Complaint getComplaintById(
        @PathVariable("id") Long id) {

    return complaintService.getComplaintById(id);
}

// Update Complaint Status
@PutMapping("/{id}")
public Complaint updateStatus(
        @PathVariable("id") Long id,
        @RequestBody Complaint complaint) {

    return complaintService.updateStatus(
            id,
            complaint.getStatus());
}

// Get Complaints By User
@GetMapping("/user/{userId}")
public List<Complaint> getByUser(
        @PathVariable("userId") Long userId) {

    return complaintService.getByUserId(userId);
}

// Delete Complaint
@DeleteMapping("/{id}")
public String deleteComplaint(
        @PathVariable("id") Long id) {

    complaintService.deleteComplaint(id);
    return "Complaint deleted successfully";
}
@GetMapping("/test")
public String test() {
    return "Complaint API Working";
}

// Dashboard Statistics
@GetMapping("/stats")
public Map<String, Long> getStatistics() {

    Map<String, Long> stats = new HashMap<>();

    stats.put("pending",
            complaintService.getPendingCount());

    stats.put("resolved",
            complaintService.getResolvedCount());

    stats.put("inProgress",
            complaintService.getInProgressCount());

    return stats;
}


}
