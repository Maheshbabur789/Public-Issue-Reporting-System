package com.mahesh.ReportingSystem.Repository;

import com.mahesh.ReportingSystem.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
   
    Optional<User> findByOtp(String otp);

    
}