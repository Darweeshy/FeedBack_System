package com.example.demo.repo;

import com.example.demo.model.FeedBack;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FeedbackRepo {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(FeedBack feedback) {
        String sql = "INSERT INTO feedback(userName, email, feedBack) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, feedback.getUserName(), feedback.getEmail(), feedback.getFeedBack());
    }

    public List<FeedBack> findAll() {
        String sql = "SELECT feedback_id, userName, email, feedBack FROM feedback";
        RowMapper<FeedBack> mapper = (rs, rowNum) -> {
            FeedBack fb = new FeedBack();
            fb.setFeedback_id(rs.getInt("feedback_id"));
            fb.setUserName(rs.getString("userName"));
            fb.setEmail(rs.getString("email"));
            fb.setFeedBack(rs.getString("feedBack"));
            return fb;
        };
        return jdbcTemplate.query(sql, mapper);
    }
}
