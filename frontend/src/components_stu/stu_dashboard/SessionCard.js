import React, { useState } from 'react';
import { Video, Clock, User, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import Modal from '../common/Modal';

const SessionCard = ({ session, isBooked = false, onBook, onJoin }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    topics: '',
    questions: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    onBook(session.id, bookingData);
    setShowBookingModal(false);
  };

  const isSessionStartingSoon = () => {
    // Check if session starts within the next 30 minutes
    const sessionTime = new Date(session.startTime);
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    return sessionTime <= thirtyMinutesFromNow && sessionTime >= now;
  };

  const canJoin = isBooked && isSessionStartingSoon();

  return (
    <div className="session-card">
      <div className="session-card-header">
        <h3>{session.title}</h3>
        <span className={`session-status ${isBooked ? 'booked' : 'available'}`}>
          {isBooked ? 'Booked' : `${session.seats} seats left`}
        </span>
      </div>
      
      <div className="session-details">
        <div className="detail-row">
          <User size={16} />
          <span>{session.mentor}</span>
        </div>
        <div className="detail-row">
          <Calendar size={16} />
          <span>{session.date}</span>
        </div>
        <div className="detail-row">
          <Clock size={16} />
          <span>{session.duration} • {session.time}</span>
        </div>
      </div>

      {isBooked ? (
        <div className="session-actions">
          {canJoin ? (
            <button 
              className="join-button" 
              onClick={() => onJoin(session.id)}
            >
              <Video size={14} /> Join Session
            </button>
          ) : (
            <div className="session-status-message">
              <CheckCircle size={16} /> Your session is confirmed
            </div>
          )}
        </div>
      ) : (
        <button 
          className="book-button" 
          onClick={() => setShowBookingModal(true)}
          disabled={session.seats <= 0}
        >
          {session.seats > 0 ? 'Book Session' : 'Fully Booked'}
        </button>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <Modal 
          title={`Book: ${session.title}`}
          onClose={() => setShowBookingModal(false)}
        >
          <form onSubmit={handleBookSubmit}>
            <div className="form-group">
              <label>Topics you want to discuss:</label>
              <input
                type="text"
                name="topics"
                value={bookingData.topics}
                onChange={handleInputChange}
                placeholder="E.g., Binary Trees, Sorting Algorithms"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Specific questions or topics:</label>
              <textarea
                name="questions"
                value={bookingData.questions}
                onChange={handleInputChange}
                placeholder="What specific areas do you need help with?"
                rows={4}
                required
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="primary-button"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SessionCard;
