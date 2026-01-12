import React from 'react';
import { styles } from '../Styles/appStyles';

const PlateVisualizer = ({ weight }) => {
  const calculatePlates = (targetWeight) => {
    const BAR_WEIGHT = 20;
    let weightPerSide = (targetWeight - BAR_WEIGHT) / 2;
    if (weightPerSide <= 0) return [];

    const availablePlates = [
      { w: 25, c: '#e74c3c' },
      { w: 20, c: '#007aff' },
      { w: 15, c: '#f1c40f' },
      { w: 10, c: '#2ecc71' },
      { w: 5, c: '#ffffff' },
      { w: 1.5, c: '#333333' },
    ];

    let platesNeeded = [];
    availablePlates.forEach((plate) => {
      while (weightPerSide >= plate.w) {
        platesNeeded.push(plate);
        weightPerSide -= plate.w;
      }
    });
    return platesNeeded;
  };

  const plates = calculatePlates(parseFloat(weight));
  const summary = plates.reduce((acc, p) => {
    acc[p.w] = (acc[p.w] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={styles.plateContainer}>
      <div style={styles.barLine}>
        <div style={styles.barSideLeft}>
          {plates.map((p, i) => (
            <div
              key={`l-${i}`}
              style={{
                ...styles.plateDisc,
                backgroundColor: p.c,
                height: `${40 + p.w * 1.2}px`,
                width: p.w >= 10 ? '14px' : '8px',
                border: p.w === 5 ? '1px solid #ccc' : '1px solid #000',
              }}
            >
              <span
                style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: p.w === 5 ? 'black' : 'white',
                }}
              >
                {p.w}
              </span>
            </div>
          ))}
        </div>
        <div style={styles.barCenter}>20kg</div>
        <div style={styles.barSideRight}>
          {plates.map((p, i) => (
            <div
              key={`r-${i}`}
              style={{
                ...styles.plateDisc,
                backgroundColor: p.c,
                height: `${40 + p.w * 1.2}px`,
                width: p.w >= 10 ? '14px' : '8px',
                border: p.w === 5 ? '1px solid #ccc' : '1px solid #000',
              }}
            >
              <span
                style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: p.w === 5 ? 'black' : 'white',
                }}
              >
                {p.w}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.loaderInstructions}>
        <strong style={{ color: '#f1c40f' }}>LOAD PER SIDE: </strong>
        {Object.entries(summary)
          .sort((a, b) => b[0] - a[0])
          .map(([w, count]) => (
            <span key={w} style={styles.instructionBadge}>
              {count} x {w}kg
            </span>
          ))}
      </div>
    </div>
  );
};

export default PlateVisualizer;
