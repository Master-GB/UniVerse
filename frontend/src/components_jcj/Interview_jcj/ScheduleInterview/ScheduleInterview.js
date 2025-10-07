import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsCalendar, BsClock, BsPersonCircle } from 'react-icons/bs'
import { FiCalendar } from 'react-icons/fi'
import "./scheduleinterview.css"

// Dummy interviewer data (would come from backend later)
const DUMMY_INTERVIEWERS = [
  {
    id: 'i1',
    name: 'Sarah Johnson',
    specialization: 'Backend Engineer',
    avatar: 'https://via.placeholder.com/72x72/0b5ed7/ffffff?text=SJ',
    slots: ['2025-10-15T09:00', '2025-10-15T11:00', '2025-10-16T14:00']
  },
  {
    id: 'i2',
    name: 'Mike Chen',
    specialization: 'Frontend Engineer',
    avatar: 'https://via.placeholder.com/72x72/0b5ed7/ffffff?text=MC',
    slots: ['2025-10-18T10:30', '2025-10-18T13:00', '2025-10-19T15:00']
  }
]

function ScheduleInterview() {
  const navigate = useNavigate()

  const [interviewerId, setInterviewerId] = useState(DUMMY_INTERVIEWERS[0].id)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('30')
  const [type, setType] = useState('Technical')
  const [platform, setPlatform] = useState('Zoom')
  const [otherLink, setOtherLink] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const selectedInterviewer = useMemo(() => DUMMY_INTERVIEWERS.find(i => i.id === interviewerId), [interviewerId])

  const availableSlotsForSelected = selectedInterviewer ? selectedInterviewer.slots : []

  const handleSlotClick = (iso) => {
    const dt = new Date(iso)
    setDate(dt.toISOString().slice(0,10))
    // set time in HH:MM
    setTime(dt.toTimeString().slice(0,5))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!interviewerId || !date || !time) {
      setConfirmation({ type: 'error', message: 'Please choose interviewer, date and time.' })
      return
    }

    // Create a mock booking object (replace with API call in future)
    const booking = {
      id: 'bk_' + Date.now(),
      interviewerId,
      date,
      time,
      duration,
      type,
      platform: platform === 'Other' ? otherLink : platform,
      notes
    }

    // For now, show a simple confirmation and redirect to dashboard after short delay
    setConfirmation({ type: 'success', message: 'Interview scheduled successfully!' })
    setTimeout(() => {
      navigate('/MIPage')
    }, 900)
  }

  return (
    <div className="schedule-page-wrapper-jcj">
      <div className="schedule-container-jcj">
        <div className="schedule-left-jcj">
          <h2 className="schedule-title-jcj"><FiCalendar className="sched-icon-jcj"/> Schedule Interview</h2>

          <form className="schedule-form-jcj" onSubmit={handleSubmit}>

            <label className="form-label-jcj">Select Interviewer</label>
            <div className="select-row-jcj">
              <select
                value={interviewerId}
                onChange={(e) => setInterviewerId(e.target.value)}
                className="select-input-jcj"
                aria-label="Select interviewer"
              >
                {DUMMY_INTERVIEWERS.map((iv) => (
                  <option key={iv.id} value={iv.id}>{iv.name} — {iv.specialization}</option>
                ))}
              </select>
            </div>

            <div className="datetime-row-jcj">
              <div className="datetime-field-jcj">
                <label className="form-label-jcj">Date</label>
                <div className="input-with-icon-jcj">
                  <BsCalendar className="input-icon-jcj" />
                  <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="date-input-jcj" />
                </div>
              </div>

              <div className="datetime-field-jcj">
                <label className="form-label-jcj">Time</label>
                <div className="input-with-icon-jcj">
                  <BsClock className="input-icon-jcj" />
                  <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} className="time-input-jcj" />
                </div>
              </div>
            </div>

            <label className="form-label-jcj">Duration</label>
            <select value={duration} onChange={(e)=>setDuration(e.target.value)} className="select-input-jcj">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>

            <label className="form-label-jcj">Interview Type</label>
            <select value={type} onChange={(e)=>setType(e.target.value)} className="select-input-jcj">
              <option>Technical</option>
              <option>Behavioral</option>
              <option>HR</option>
            </select>

            <label className="form-label-jcj">Preferred Meeting Platform</label>
            <select value={platform} onChange={(e)=>setPlatform(e.target.value)} className="select-input-jcj">
              <option>Zoom</option>
              <option>Teams</option>
              <option value="Other">Other (link)</option>
            </select>

            {platform === 'Other' && (
              <input
                type="url"
                placeholder="https://meet.example.com/your-link"
                value={otherLink}
                onChange={(e)=>setOtherLink(e.target.value)}
                className="text-input-jcj"
              />
            )}

            <label className="form-label-jcj">Notes (optional)</label>
            <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} className="textarea-input-jcj" rows={4} />

            <div className="slot-preview-jcj">
              <label className="form-label-jcj">Available Slots for {selectedInterviewer?.name}</label>
              <div className="slots-row-jcj">
                {availableSlotsForSelected.length === 0 && (
                  <div className="no-slots-jcj">No slots available</div>
                )}
                {availableSlotsForSelected.map(slot => (
                  <button type="button" key={slot} className="slot-pill-jcj" onClick={()=>handleSlotClick(slot)}>
                    {new Date(slot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions-jcj">
              <button type="submit" className="schedule-submit-btn-jcj">Schedule Interview</button>
            </div>

            {confirmation && (
              <div className={`confirmation-msg-jcj ${confirmation.type === 'success' ? 'success-jcj' : 'error-jcj'}`}>
                {confirmation.message}
              </div>
            )}

          </form>
        </div>

        <aside className="schedule-right-jcj">
          <div className="preview-card-jcj">
            <div className="preview-top-jcj">
              <img src={selectedInterviewer?.avatar} alt={selectedInterviewer?.name} className="preview-avatar-jcj" />
              <div className="preview-meta-jcj">
                <div className="preview-name-jcj">{selectedInterviewer?.name}</div>
                <div className="preview-spec-jcj">{selectedInterviewer?.specialization}</div>
              </div>
            </div>

            <div className="preview-available-jcj">
              <div className="preview-available-title-jcj">Available Slots</div>
              <div className="preview-slots-list-jcj">
                {availableSlotsForSelected.map(slot => (
                  <div key={slot} className="preview-slot-item-jcj">
                    <BsPersonCircle className="slot-icon-jcj" />
                    <div>
                      <div className="slot-time-jcj">{new Date(slot).toLocaleDateString()} — {new Date(slot).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

export default ScheduleInterview
