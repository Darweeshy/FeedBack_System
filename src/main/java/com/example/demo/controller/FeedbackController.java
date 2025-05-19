package com.example.demo.controller;

import com.example.demo.model.FeedBack;
import com.example.demo.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback") // Base path for all feedback related APIs
@CrossOrigin(origins = "*") // Allows requests from any origin. For production, restrict this to your frontend's domain.
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // Endpoint to submit new feedback
    // HTTP POST requests to /api/feedback will be handled by this method
    @PostMapping
    public ResponseEntity<FeedBack> submitFeedback(@RequestBody FeedBack feedback) {
        // Log the received feedback
        System.out.println("Received feedback to submit: " + feedback);
        try {
            feedbackService.addFeedback(feedback);
            // Log success
            System.out.println("Feedback successfully added: " + feedback);
            // Return the saved feedback and HTTP status 201 (Created)
            // Note: The 'feedback' object returned here won't have the database-generated ID
            // if your service.addFeedback doesn't explicitly return the persisted entity with the ID.
            return new ResponseEntity<>(feedback, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error submitting feedback: " + e.getMessage());
            e.printStackTrace();
            // Return an error response
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint to get all feedback
    // HTTP GET requests to /api/feedback will be handled by this method
    @GetMapping
    public ResponseEntity<List<FeedBack>> getAllFeedback() {
        System.out.println("Attempting to retrieve all feedback.");
        try {
            List<FeedBack> feedbacks = feedbackService.getFeedback();
            if (feedbacks.isEmpty()) {
                System.out.println("No feedback found.");
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // No feedback found
            }
            System.out.println("Retrieved " + feedbacks.size() + " feedback items.");
            return new ResponseEntity<>(feedbacks, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error retrieving feedback: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} // This was the extra brace in your original file, now it's correct.
