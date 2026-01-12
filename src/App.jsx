import React, { useState, useEffect } from 'react';
import PlateVisualizer from './components/PlateVisualizer';
import { styles } from './Styles/appStyles';

const App = () => {
  // --- STATE & PERSISTENCE ---
  const [competitors, setCompetitors] = useState(() => {
    const saved = localStorage.getItem('deadlift_final_v5');
    return saved ? JSON.parse(saved) : [];
  });

  const [modalData, setModalData] = useState(null);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [newComp, setNewComp] = useState({
    name: '',
    bw: '',
    lift1: '',
    category: '',
    gender: '',
  });

  useEffect(() => {
    localStorage.setItem('deadlift_final_v5', JSON.stringify(competitors));
  }, [competitors]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // --- CORE FUNCTIONS ---
  const sortCompetitors = (data, liftIdx) => {
    return [...data].sort((a, b) => {
      const valA = parseFloat(a.lifts[liftIdx]) || 0;
      const valB = parseFloat(b.lifts[liftIdx]) || 0;
      if (valA !== valB) return valA - valB;
      return (parseFloat(a.bw) || 0) - (parseFloat(b.bw) || 0);
    });
  };

  const addCompetitor = () => {
    if (
      !newComp.name ||
      !newComp.lift1 ||
      !newComp.category ||
      !newComp.gender
    ) {
      alert('Please fill all fields');
      return;
    }
    const createdComp = {
      id: Date.now(),
      name: newComp.name,
      bw: newComp.bw,
      category: newComp.category,
      gender: newComp.gender,
      lifts: [newComp.lift1, '', ''],
      status: [null, null, null],
    };
    setCompetitors(sortCompetitors([...competitors, createdComp], 0));
    setNewComp({ name: '', bw: '', lift1: '', category: '', gender: '' });
  };

  const updateAndSort = (compIdx, liftIdx, value) => {
    const updated = [...competitors];
    updated[compIdx].lifts[liftIdx] = value;
    setCompetitors(sortCompetitors(updated, liftIdx));
  };

  const handleResult = (isGood) => {
    const updated = [...competitors];
    updated[modalData.compIdx].status[modalData.liftIdx] = isGood;
    setCompetitors(updated);
    closeModal();
  };

  const openModal = (compIdx, liftIdx) => {
    const weight = competitors[compIdx].lifts[liftIdx];
    if (!weight || weight.trim() === '') return;
    setModalData({ compIdx, liftIdx });
    setTimer(60);
    setIsTimerRunning(false);
  };

  const closeModal = () => {
    setModalData(null);
    setIsTimerRunning(false);
  };

  const resetAll = () => {
    if (window.confirm('Delete all data?')) {
      setCompetitors([]);
      localStorage.removeItem('deadlift_final_v5');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>DEADLIFT MEET MANAGER</h1>
      </header>

      <section style={styles.adminPanel}>
        <input
          style={styles.input}
          placeholder="Lifter Name"
          value={newComp.name}
          onChange={(e) => setNewComp({ ...newComp, name: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="BW"
          type="number"
          value={newComp.bw}
          onChange={(e) => setNewComp({ ...newComp, bw: e.target.value })}
        />
        <select
          style={{
            ...styles.input,
            color: newComp.gender === '' ? '#888' : '#000',
          }}
          value={newComp.gender}
          onChange={(e) => setNewComp({ ...newComp, gender: e.target.value })}
        >
          <option value="" disabled>
            Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          style={{
            ...styles.input,
            color: newComp.category === '' ? '#888' : '#000',
          }}
          value={newComp.category}
          onChange={(e) => setNewComp({ ...newComp, category: e.target.value })}
        >
          <option value="" disabled>
            Category
          </option>
          <option value="Open">Open</option>
          <option value="Masters">Masters</option>
        </select>
        <input
          style={styles.input}
          placeholder="Attempt 1"
          type="number"
          value={newComp.lift1}
          onChange={(e) => setNewComp({ ...newComp, lift1: e.target.value })}
        />
        <button onClick={addCompetitor} style={styles.btnAdd}>
          ADD
        </button>
        <button onClick={resetAll} style={styles.btnReset}>
          RESET
        </button>
      </section>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Gender</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>BW</th>
              <th style={styles.th}>Attempt1</th>
              <th style={styles.th}>Attempt2</th>
              <th style={styles.th}>Attempt3</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, cIdx) => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.tdName}>{c.name}</td>
                <td style={styles.td}>{c.gender}</td>
                <td style={styles.td}>{c.category}</td>
                <td style={styles.td}>{c.bw}kg</td>
                {c.lifts.map((l, lIdx) => (
                  <td
                    key={lIdx}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateAndSort(cIdx, lIdx, e.target.innerText)
                    }
                    onDoubleClick={() => openModal(cIdx, lIdx)}
                    style={{
                      ...styles.cell,
                      backgroundColor:
                        c.status[lIdx] === true
                          ? '#2ecc71'
                          : c.status[lIdx] === false
                          ? '#e74c3c'
                          : 'white',
                      color: c.status[lIdx] !== null ? 'white' : 'black',
                    }}
                  >
                    {l}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalData && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <p style={styles.modalCategory}>
              {competitors[modalData.compIdx].gender} |{' '}
              {competitors[modalData.compIdx].category}
            </p>
            <h2 style={styles.modalName}>
              {competitors[modalData.compIdx].name}
            </h2>
            <h1 style={styles.modalWeight}>
              {competitors[modalData.compIdx].lifts[modalData.liftIdx]} kg
            </h1>
            <div style={styles.stageSeparator}>
              {!isTimerRunning && (
                <PlateVisualizer
                  weight={
                    competitors[modalData.compIdx].lifts[modalData.liftIdx]
                  }
                />
              )}
            </div>
            <div
              style={{
                ...styles.timer,
                color: timer <= 10 ? '#ff4d4d' : 'white',
              }}
            >
              {timer}
            </div>
            <div style={styles.actionContainer}>
              {!isTimerRunning && timer === 60 ? (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  style={styles.btnStart}
                >
                  START TIMER
                </button>
              ) : (
                <div style={styles.resultButtons}>
                  <button
                    onClick={() => handleResult(true)}
                    style={styles.btnGood}
                  >
                    GOOD LIFT
                  </button>
                  <button
                    onClick={() => handleResult(false)}
                    style={styles.btnBad}
                  >
                    NO LIFT
                  </button>
                </div>
              )}
            </div>
            <button onClick={closeModal} style={styles.btnClose}>
              CANCEL / BACK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
