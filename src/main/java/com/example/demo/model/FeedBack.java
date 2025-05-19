package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "feedback")
public class FeedBack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int feedback_id;

    private String userName;
    private String email;
    private String feedBack;

    // Getters and setters
    public int getFeedback_id() {
        return feedback_id;
    }

    public void setFeedback_id(int feedback_id) {
        this.feedback_id = feedback_id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFeedBack() {
        return feedBack;
    }

    public void setFeedBack(String feedBack) {
        this.feedBack = feedBack;
    }

    @Override
    public String toString() {
        return "FeedBack{" +
                "feedback_id=" + feedback_id +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", feedBack='" + feedBack + '\'' +
                '}';
    }
}
