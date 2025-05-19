CREATE TABLE IF NOT EXISTS feedback (
                                        feedback_id SERIAL PRIMARY KEY,
                                        userName VARCHAR(255),
    email VARCHAR(255),
    feedBack TEXT
    );
