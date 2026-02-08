import './CustomerFeedback.css';

const CustomerFeedback = () => {
  const feedbacks = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Amazing quality milk delivered fresh every morning! The AI assistant is so helpful for tracking orders.",
      avatar: "👩"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      comment: "Best dairy products in the city. Their ghee is pure and authentic. Highly recommend!",
      avatar: "👨"
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Pune",
      rating: 4,
      comment: "Great service and timely delivery. The paneer is always fresh and tasty.",
      avatar: "👩‍🦳"
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Bangalore",
      rating: 5,
      comment: "Excellent customer service! The payment process is smooth and secure.",
      avatar: "👨‍💼"
    }
  ];

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <section className="customer-feedback">
      <div className="feedback-container">
        <div className="feedback-header">
          <h2>OUR CUSTOMERS</h2>
          <p>Real feedback from our satisfied customers</p>
        </div>
        
        <div className="feedback-grid">
          {feedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-rating">
                {renderStars(feedback.rating)}
              </div>
              <p className="feedback-comment">"{feedback.comment}"</p>
              <div className="feedback-author">
                <span className="author-avatar">{feedback.avatar}</span>
                <div className="author-info">
                  <h4>{feedback.name}</h4>
                  <span>{feedback.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedback;