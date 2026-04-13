import React, { useState } from 'react'
import { format, addDays, differenceInDays, parseISO } from 'date-fns'

const SUBJECT_EMOJIS = {
  Mathematics: '📐', Physics: '⚡', Chemistry: '🧪', Biology: '🧬',
  English: '📖', Hindi: '🗣️', History: '🏛️', Geography: '🌍',
  Economics: '📊', Accountancy: '🧾', 'Computer Science': '💻',
  'Political Science': '⚖️',
}

export default function StudySchedule() {
  const [subjects, setSubjects] = useState([{ name: '', hoursPerDay: 1, priority: 'Medium' }])
  const [examDate, setExamDate] = useState('')
  const [dailyHours, setDailyHours] = useState(6)
  const [schedule, setSchedule] = useState(null)
  const [showTips, setShowTips] = useState(false)

  const addSubject = () => {
    setSubjects(s => [...s, { name: '', hoursPerDay: 1, priority: 'Medium' }])
  }

  const removeSubject = (i) => {
    setSubjects(s => s.filter((_, idx) => idx !== i))
  }

  const updateSubject = (i, field, val) => {
    setSubjects(s => s.map((sub, idx) => idx === i ? { ...sub, [field]: val } : sub))
  }

  const generateSchedule = () => {
    if (!examDate || subjects.some(s => !s.name)) {
      alert('Please fill in all subjects and select an exam date.')
      return
    }

    const today = new Date()
    const exam  = parseISO(examDate)
    const totalDays = differenceInDays(exam, today)

    if (totalDays <= 0) { alert('Exam date must be in the future!'); return }

    // Priority weights: High=3, Medium=2, Low=1
    const weights = { High: 3, Medium: 2, Low: 1 }
    const totalWeight = subjects.reduce((sum, s) => sum + weights[s.priority], 0)

    // Allocate days per subject based on priority
    const subjectsWithDays = subjects.map(s => ({
      ...s,
      daysAllocated: Math.max(1, Math.round((weights[s.priority] / totalWeight) * totalDays)),
    }))

    // Build weekly timetable
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const weekly = days.map((day, dayIdx) => {
      const isRestDay = day === 'Sunday' && totalDays > 14
      if (isRestDay) return { day, isRest: true, sessions: [] }

      // Rotate subjects across days
      const todaySubs = subjects.filter((_, i) => i % (days.length - 1) === dayIdx % subjects.length)
      const allSubs   = subjects
      const scheduled = allSubs.map((sub, i) => ({
        subject: sub.name,
        emoji:   SUBJECT_EMOJIS[sub.name] || '📚',
        hours:   Math.max(0.5, dailyHours / allSubs.length),
        priority:sub.priority,
      }))

      return { day, isRest: false, sessions: scheduled }
    })

    setSchedule({ weekly, totalDays, examDate, subjects: subjectsWithDays })
    setShowTips(true)
  }

  const downloadSchedule = () => {
    if (!schedule) return
    const lines = [
      '===== STUDY SCHEDULE =====',
      `Exam Date: ${format(parseISO(schedule.examDate), 'MMMM d, yyyy')}`,
      `Days Remaining: ${schedule.totalDays}`,
      `Daily Study Hours: ${dailyHours}`,
      '',
      '=== WEEKLY TIMETABLE ===',
      ...schedule.weekly.map(day => {
        if (day.isRest) return `\n${day.day}: REST DAY`
        return [
          `\n${day.day}:`,
          ...day.sessions.map(s => `  - ${s.subject}: ${s.hours.toFixed(1)} hrs`),
        ].join('\n')
      }),
      '',
      '=== SUBJECT ALLOCATION ===',
      ...schedule.subjects.map(s => `${s.name}: ${s.daysAllocated} days (Priority: ${s.priority})`),
      '',
      '=== STUDY TIPS ===',
      '1. Use Pomodoro: 25 min study, 5 min break',
      '2. Review previous day\'s notes every morning',
      '3. Practice past papers in last 2 weeks',
      '4. Stay hydrated and sleep 7-8 hours',
      '5. Take Sunday as a lighter revision day',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'study-schedule.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>📅 Study Schedule Generator</h1>
        <p style={{ color: '#64748b', marginTop: '.35rem' }}>
          Enter your subjects, exam date, and available study hours — get a personalized timetable!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Input Panel */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Study Parameters</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Exam / Target Date</label>
                <input type="date" className="form-input" value={examDate}
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  onChange={e => setExamDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Available Study Hours per Day: <strong>{dailyHours}h</strong></label>
                <input type="range" min={2} max={12} value={dailyHours}
                  onChange={e => setDailyHours(Number(e.target.value))}
                  style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: '#94a3b8' }}>
                  <span>2h</span><span>12h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Subjects</h2>
              <button className="btn btn-secondary btn-sm" onClick={addSubject}>+ Add Subject</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {subjects.map((sub, i) => (
                <div key={i} style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                  <select className="form-input" style={{ flex: 2 }}
                    value={sub.name} onChange={e => updateSubject(i, 'name', e.target.value)}>
                    <option value="">-- Select Subject --</option>
                    {Object.keys(SUBJECT_EMOJIS).map(s => <option key={s} value={s}>{SUBJECT_EMOJIS[s]} {s}</option>)}
                  </select>
                  <select className="form-input" style={{ flex: 1 }}
                    value={sub.priority} onChange={e => updateSubject(i, 'priority', e.target.value)}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  {subjects.length > 1 && (
                    <button style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1.1rem', flexShrink: 0 }}
                      onClick={() => removeSubject(i)}>×</button>
                  )}
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
              onClick={generateSchedule}>
              Generate Schedule
            </button>
          </div>
        </div>

        {/* Schedule Output */}
        <div>
          {schedule ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontWeight: 800 }}>Your Timetable</h2>
                  <p style={{ color: '#64748b', fontSize: '.875rem' }}>
                    {schedule.totalDays} days until {format(parseISO(schedule.examDate), 'MMMM d, yyyy')}
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={downloadSchedule}>
                  ⬇ Download
                </button>
              </div>

              {/* Subject allocation */}
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '.75rem', fontSize: '.9rem' }}>Subject Allocation</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  {schedule.subjects.map(s => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <span>{SUBJECT_EMOJIS[s.name] || '📚'}</span>
                      <span style={{ flex: 1, fontSize: '.875rem', fontWeight: 600 }}>{s.name}</span>
                      <span className={`badge ${s.priority === 'High' ? 'badge-red' : s.priority === 'Medium' ? 'badge-yellow' : 'badge-green'}`}>
                        {s.priority}
                      </span>
                      <span style={{ fontSize: '.8rem', color: '#64748b' }}>{s.daysAllocated} days</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                {schedule.weekly.map(day => (
                  <div key={day.day} className="card" style={{
                    borderLeft: `4px solid ${day.isRest ? '#94a3b8' : '#2563eb'}`,
                    padding: '1rem'
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: day.isRest ? 0 : '.5rem', fontSize: '.9rem' }}>
                      {day.day} {day.isRest && <span style={{ color: '#64748b', fontWeight: 400 }}>— Rest Day</span>}
                    </div>
                    {!day.isRest && day.sessions.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', color: '#334155', marginBottom: '.25rem' }}>
                        <span>{s.emoji} {s.subject}</span>
                        <span style={{ color: '#64748b' }}>{s.hours.toFixed(1)}h</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {showTips && (
                <div className="card" style={{ marginTop: '1rem', background: '#eff6ff' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '.75rem', fontSize: '.9rem' }}>💡 Study Tips</h3>
                  {['Use Pomodoro technique: 25 min study + 5 min break',
                    'Review yesterday\'s notes every morning (5 min)',
                    'Solve past year papers in the last 2 weeks',
                    'Sleep 7-8 hours — memory consolidates during sleep!',
                    'Practice active recall over passive reading'].map((tip, i) => (
                    <p key={i} style={{ fontSize: '.82rem', color: '#1d4ed8', marginBottom: '.35rem' }}>• {tip}</p>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94a3b8', gap: '1rem' }}>
              <div style={{ fontSize: '3rem' }}>📋</div>
              <p>Your timetable will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
