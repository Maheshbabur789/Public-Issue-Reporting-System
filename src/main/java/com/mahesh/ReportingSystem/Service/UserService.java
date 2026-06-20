package com.mahesh.ReportingSystem.Service;

import com.mahesh.ReportingSystem.Entity.User;
import com.mahesh.ReportingSystem.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class UserService {


@Autowired
private UserRepository userRepository;

@Autowired
private JavaMailSender mailSender;

// ================= REGISTER =================

public User register(User user) {

    if (user == null) {
        return null;
    }

    if (user.getName() == null || user.getName().trim().isEmpty()) {
        return null;
    }

    if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
        return null;
    }

    if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
        return null;
    }

    Optional<User> existingUser =
            userRepository.findByEmail(user.getEmail().trim());

    if (existingUser.isPresent()) {
        return null;
    }

    if (user.getRole() == null || user.getRole().isEmpty()) {
        user.setRole("USER");
    }

    return userRepository.save(user);
}

// ================= LOGIN =================

public User login(String email, String password) {

    Optional<User> optionalUser =
            userRepository.findByEmail(email.trim());

    if (optionalUser.isEmpty()) {
        return null;
    }

    User user = optionalUser.get();

    if (!user.getPassword().equals(password)) {
        return null;
    }

    return user;
}

// ================= FIND USER =================

public User findByEmail(String email) {

    Optional<User> optionalUser =
            userRepository.findByEmail(email.trim());

    return optionalUser.orElse(null);
}

// ================= SEND OTP =================

public boolean sendOtp(String email) {

    Optional<User> optionalUser =
            userRepository.findByEmail(email.trim());

    if (optionalUser.isEmpty()) {
        return false;
    }

    User user = optionalUser.get();

    String otp = String.valueOf(
            100000 + new Random().nextInt(900000));

    user.setOtp(otp);

    user.setOtpExpiry(
            System.currentTimeMillis() + (5 * 60 * 1000));

    userRepository.save(user);

    try {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(user.getEmail());

        message.setSubject(
                "IssuePortal OTP Verification");

        message.setText(
                "Hello " + user.getName()
                + "\n\nYour OTP is: "
                + otp
                + "\n\nValid for 5 minutes."
        );

        mailSender.send(message);

    } catch (Exception e) {

        e.printStackTrace();

        return false;
    }

    return true;
}

// ================= VERIFY OTP =================

public boolean verifyOtp(
        String email,
        String otp) {

    Optional<User> optionalUser =
            userRepository.findByEmail(email.trim());

    if (optionalUser.isEmpty()) {
        return false;
    }

    User user = optionalUser.get();

    if (user.getOtp() == null) {
        return false;
    }

    if (!user.getOtp().equals(otp)) {
        return false;
    }

    if (user.getOtpExpiry() == null ||
            user.getOtpExpiry() < System.currentTimeMillis()) {
        return false;
    }

    return true;
}

// ================= RESET PASSWORD =================

public boolean resetPassword(
        String email,
        String otp,
        String newPassword) {

    Optional<User> optionalUser =
            userRepository.findByEmail(email.trim());

    if (optionalUser.isEmpty()) {
        return false;
    }

    User user = optionalUser.get();

    if (user.getOtp() == null) {
        return false;
    }

    if (!user.getOtp().equals(otp)) {
        return false;
    }

    if (user.getOtpExpiry() == null ||
            user.getOtpExpiry() < System.currentTimeMillis()) {
        return false;
    }

    user.setPassword(newPassword);

    user.setOtp(null);
    user.setOtpExpiry(null);

    userRepository.save(user);

    return true;
}


}
