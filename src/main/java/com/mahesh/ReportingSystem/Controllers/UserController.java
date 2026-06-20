package com.mahesh.ReportingSystem.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mahesh.ReportingSystem.Entity.User;
import com.mahesh.ReportingSystem.Repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable("id") Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                new RuntimeException("User not found"));
    }

}