package com.example.demo.services;

import com.example.demo.model.FeedBack;
import com.example.demo.repo.FeedbackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private FeedbackRepo feedbackRepo;

    @Autowired
    public void setFeedbackRepo(FeedbackRepo feedbackRepo) {
        this.feedbackRepo = feedbackRepo;
    }

    public void addFeedback(FeedBack feedBack) {
        feedbackRepo.save(feedBack);
    }

    public List<FeedBack> getFeedback() {
        return feedbackRepo.findAll();
    }
}
