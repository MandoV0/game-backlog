package com.gamebacklog.backend.controller;

import com.gamebacklog.backend.model.User;
import com.gamebacklog.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/users")
public class UserController {

    @Autowired
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestParam String username, @RequestParam String password) {
        System.out.println("Login attempt with:");
        System.out.println("  Username: " + username);
        System.out.println("  Password: " + password);
        
        try {
            boolean isValid = userService.validateUserLogin(username, password);
            if (isValid) {
                System.out.println("Login successful");
                return ResponseEntity.ok("Login successful");
            } else {
                System.out.println("Login failed");
                return ResponseEntity.status(401).body("Invalid username or password");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<Optional<User>> getUserByUsername(@PathVariable String username) {
        User user = userService.findUserByName(username);  // Call service to fetch the user
        if (user != null) {
            return ResponseEntity.ok(Optional.of(user));  // If user found, return user with HTTP 200
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // User not found, return 404
        }
    }
}
