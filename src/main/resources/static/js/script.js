// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const clientView = document.getElementById('clientView');
    const adminView = document.getElementById('adminView');
    const showClientViewBtn = document.getElementById('showClientViewBtn');
    const showAdminViewBtn = document.getElementById('showAdminViewBtn');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackList = document.getElementById('feedbackList');
    const noFeedbackMessage = document.getElementById('noFeedbackMessage');
    const messageBox = document.getElementById('messageBox');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Backend API URL (Ensure your Spring Boot app is running and accessible here)
    const API_BASE_URL = 'http://localhost:8080/api/feedback';

    // --- View Switching Logic ---
    function setActiveView(viewToShow) {
        if (clientView) clientView.classList.remove('active');
        if (adminView) adminView.classList.remove('active');
        if (showClientViewBtn) showClientViewBtn.classList.remove('active');
        if (showAdminViewBtn) showAdminViewBtn.classList.remove('active');

        if (viewToShow === 'client') {
            if (clientView) clientView.classList.add('active');
            if (showClientViewBtn) showClientViewBtn.classList.add('active');
        } else if (viewToShow === 'admin') {
            if (adminView) adminView.classList.add('active');
            if (showAdminViewBtn) showAdminViewBtn.classList.add('active');
            loadFeedbacks();
        }
    }

    if (showClientViewBtn) {
        showClientViewBtn.addEventListener('click', () => setActiveView('client'));
    }
    if (showAdminViewBtn) {
        showAdminViewBtn.addEventListener('click', () => setActiveView('admin'));
    }

    // --- Message Box Logic ---
    function showMessage(message, type = 'success', duration = 3000) {
        if (!messageBox) return;

        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.classList.add('show');

        setTimeout(() => {
            messageBox.classList.remove('show');
        }, duration);
    }

    // --- Feedback Logic ---
    async function loadFeedbacks() {
        if (!loadingIndicator || !feedbackList || !noFeedbackMessage) return;

        loadingIndicator.style.display = 'block';
        feedbackList.innerHTML = '';
        noFeedbackMessage.style.display = 'none';

        try {
            console.log('Fetching feedbacks from:', API_BASE_URL);
            const response = await fetch(API_BASE_URL);
            console.log('Load feedbacks response status:', response.status);

            if (response.status === 204) {
                noFeedbackMessage.style.display = 'block';
                return;
            }

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Failed to load feedback - Response not OK:', response.status, errorData);
                throw new Error(`Failed to load feedback: ${response.status} ${errorData || response.statusText}`);
            }

            const feedbacks = await response.json();
            console.log('Feedbacks loaded:', feedbacks);

            if (!feedbacks || feedbacks.length === 0) {
                noFeedbackMessage.style.display = 'block';
            } else {
                if (feedbacks[0] && typeof feedbacks[0].feedback_id === 'number') {
                    feedbacks.sort((a, b) => b.feedback_id - a.feedback_id);
                }

                feedbacks.forEach(fb => {
                    const feedbackItem = document.createElement('div');
                    feedbackItem.className = 'p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm';
                    feedbackItem.innerHTML = `
                        <div class="flex justify-between items-start mb-1">
                            <h3 class="font-semibold text-gray-700">${fb.userName || 'Anonymous'}</h3>
                            <span class="text-xs text-gray-400">ID: ${fb.feedback_id}</span>
                        </div>
                        ${fb.email ? `<p class="text-sm text-gray-500 mb-1">Email: ${fb.email}</p>` : ''}
                        <p class="text-gray-600 whitespace-pre-wrap">${fb.feedBack}</p>
                    `;
                    feedbackList.appendChild(feedbackItem);
                });
            }
        } catch (error) {
            console.error('Error in loadFeedbacks function:', error);
            showMessage(`Error loading feedback: ${error.message}`, 'error', 5000);
            noFeedbackMessage.textContent = 'Could not load feedback. Please try again later.';
            noFeedbackMessage.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const userNameInput = document.getElementById('userName');
            const userEmailInput = document.getElementById('userEmail');
            const feedBackInput = document.getElementById('feedBack');

            const userName = userNameInput ? userNameInput.value.trim() : '';
            const userEmail = userEmailInput ? userEmailInput.value.trim() : '';
            const feedBackText = feedBackInput ? feedBackInput.value.trim() : '';

            if (!feedBackText) {
                showMessage('Feedback message cannot be empty.', 'error');
                return;
            }
            if (userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            const feedbackData = {
                userName: userName || null,
                email: userEmail || null,
                feedBack: feedBackText
            };
            console.log('Submitting feedback data:', JSON.stringify(feedbackData));

            const submitButton = feedbackForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.textContent : 'Submit Feedback';
            if (submitButton) {
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
            }

            try {
                const response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feedbackData),
                });
                console.log('Submit feedback response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.text();
                    console.error('Failed to submit feedback - Response not OK:', response.status, errorData);
                    throw new Error(`Failed to submit feedback: ${response.status} ${errorData || response.statusText}`);
                }

                // const responseData = await response.json(); // If backend returns JSON
                // console.log('Feedback submission response data:', responseData);


                showMessage('Feedback submitted successfully!', 'success');
                feedbackForm.reset();

                if (adminView && adminView.classList.contains('active')) {
                    loadFeedbacks();
                }

            } catch (error) {
                console.error('Error in feedback submission function:', error);
                showMessage(`Error submitting feedback: ${error.message}`, 'error', 5000);
            } finally {
                if (submitButton) {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
            }
        });
    }

    setActiveView('client');

    const disclaimer = document.createElement('p');
    disclaimer.className = 'text-xs text-gray-500 text-center mt-8 fixed bottom-4 left-0 right-0';
    disclaimer.innerHTML = '<strong>Note:</strong> This form submits data to a backend server (expected at ' + API_BASE_URL + '). Ensure your Spring Boot application is running.';
    document.body.appendChild(disclaimer);
});
