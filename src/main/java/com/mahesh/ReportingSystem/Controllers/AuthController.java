package com.mahesh.ReportingSystem.Controllers;

import com.mahesh.ReportingSystem.Entity.User;
import com.mahesh.ReportingSystem.Service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {


@Autowired
private UserService userService;

// ================= REGISTER =================

@PostMapping("/register")
public ResponseEntity<?> register(
        @RequestBody User user) {

    User savedUser = userService.register(user);

    if (savedUser == null) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Email already exists");
    }

    savedUser.setPassword(null);

    return ResponseEntity.ok(savedUser);
}

// ================= LOGIN =================

@PostMapping("/login")
public ResponseEntity<?> login(
        @RequestBody User user) {

    User loggedUser =
            userService.login(
                    user.getEmail(),
                    user.getPassword());

    if (loggedUser == null) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
    }

    loggedUser.setPassword(null);

    return ResponseEntity.ok(loggedUser);
}

// ================= SEND OTP =================

@PostMapping("/send-otp")
public ResponseEntity<?> sendOtp(
        @RequestParam("email") String email) {

    System.out.println(
            "EMAIL RECEIVED = " + email);

    boolean success =
            userService.sendOtp(email);

    if (!success) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Failed to send OTP");
    }

    return ResponseEntity.ok(
            "OTP sent successfully");
}

// ================= VERIFY OTP =================

@PostMapping("/verify-otp")
public ResponseEntity<?> verifyOtp(
        @RequestParam("email") String email,
        @RequestParam("otp") String otp) {

    boolean success =
            userService.verifyOtp(
                    email,
                    otp);

    if (!success) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Invalid or expired OTP");
    }

    return ResponseEntity.ok(
            "OTP verified successfully");
}

// ================= RESET PASSWORD =================

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(
        @RequestParam("email") String email,
        @RequestParam("otp") String otp,
        @RequestParam("newPassword") String newPassword) {

    boolean success =
            userService.resetPassword(
                    email,
                    otp,
                    newPassword);

    if (!success) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Invalid OTP or OTP expired");
    }

    return ResponseEntity.ok(
            "Password reset successful");
}

// ================= TEST =================

@GetMapping("/test")
public String test() {

    return "Auth Controller Working";
}


}
