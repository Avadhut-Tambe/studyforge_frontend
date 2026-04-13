import React from 'react'

const STREAMS   = ['Science', 'Commerce', 'Arts', 'Vocational']
const GRADES    = ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12','Undergraduate','Postgraduate']
const SUBJECTS  = ['Mathematics','Physics','Chemistry','Biology','English','Hindi','History','Geography','Economics','Accountancy','Computer Science','Political Science']
const CATEGORIES= ['Textbook','Reference','Novel','Guide','Question Bank','Sample Papers']

export default function BookFilters({ filters, onChange }) {

  const set = (key, val) => onChange({ ...filters, [key]: val })

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <span style={{ fontWeight: 700, fontSize: '.95rem' }}>Filters</span>
        <button style={styles.clearBtn}
          onClick={() => onChange({ minPrice: '', maxPrice: '', grade: '', subject: '', stream: '', category: '', minRating: '' })}>
          Clear All
        </button>
      </div>

      <FilterSection title="Stream">
        {STREAMS.map(s => (
          <label key={s} style={styles.checkLabel}>
            <input type="radio" name="stream" value={s}
              checked={filters.stream === s}
              onChange={() => set('stream', filters.stream === s ? '' : s)}
            /> {s}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Grade / Class">
        <select style={styles.select} value={filters.grade || ''}
          onChange={e => set('grade', e.target.value)}>
          <option value="">All Grades</option>
          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </FilterSection>

      <FilterSection title="Subject">
        <select style={styles.select} value={filters.subject || ''}
          onChange={e => set('subject', e.target.value)}>
          <option value="">All Subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </FilterSection>

      <FilterSection title="Category">
        {CATEGORIES.map(c => (
          <label key={c} style={styles.checkLabel}>
            <input type="radio" name="category" value={c}
              checked={filters.category === c}
              onChange={() => set('category', filters.category === c ? '' : c)}
            /> {c}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Price Range (₹)">
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={styles.numInput} type="number" placeholder="Min"
            value={filters.minPrice || ''} onChange={e => set('minPrice', e.target.value)} />
          <input style={styles.numInput} type="number" placeholder="Max"
            value={filters.maxPrice || ''} onChange={e => set('maxPrice', e.target.value)} />
        </div>
      </FilterSection>

      <FilterSection title="Min Rating">
        {[4, 3, 2].map(r => (
          <label key={r} style={styles.checkLabel}>
            <input type="radio" name="rating" value={r}
              checked={Number(filters.minRating) === r}
              onChange={() => set('minRating', filters.minRating == r ? '' : r)}
            />
            {'★'.repeat(r)}{'☆'.repeat(5 - r)} & above
          </label>
        ))}
      </FilterSection>
    </aside>
  )
}

function FilterSection({ title, children }) {
  return (
    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
      <div style={{ fontWeight: 600, fontSize: '.85rem', color: '#334155', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: .3 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>{children}</div>
    </div>
  )
}

const styles = {
  sidebar: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem', height: 'fit-content', minWidth: 220 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  clearBtn: { background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '.85rem', cursor: 'pointer', color: '#334155' },
  select: { width: '100%', padding: '.45rem .75rem', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: '.85rem', outline: 'none' },
  numInput: { width: '50%', padding: '.4rem .5rem', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: '.85rem', outline: 'none' },
}
