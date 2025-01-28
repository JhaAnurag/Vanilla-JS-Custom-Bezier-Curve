let P0 = { x: 0, y: 1 };
let P1 = { x: 0.25, y: -0.5 };
let P2 = { x: 0.75, y: 1.5 };
let P3 = { x: 1, y: 0 };

const svg = document.getElementById("graph");
const curve = document.getElementById("curve");
const p1Circle = document.getElementById("p1");
const p2Circle = document.getElementById("p2");
const p1Label = document.getElementById("p1-label");
const p2Label = document.getElementById("p2-label");

function updateGraph() {
  curve.setAttribute(
    "d",
    `M ${P0.x * 200 + 200} ${P0.y * 200 + 200} C ${P1.x * 200 + 200} ${
      P1.y * 200 + 200
    }, ${P2.x * 200 + 200} ${P2.y * 200 + 200}, ${P3.x * 200 + 200} ${
      P3.y * 200 + 200
    }`
  );

  p1Circle.setAttribute("cx", P1.x * 200 + 200);
  p1Circle.setAttribute("cy", P1.y * 200 + 200);
  p2Circle.setAttribute("cx", P2.x * 200 + 200);
  p2Circle.setAttribute("cy", P2.y * 200 + 200);

  p1Label.setAttribute("x", P1.x * 200 + 200 + 10);
  p1Label.setAttribute("y", P1.y * 200 + 200 - 10);
  p1Label.textContent = `(${P1.x.toFixed(2)}, ${P1.y.toFixed(2)})`;

  p2Label.setAttribute("x", P2.x * 200 + 200 + 10);
  p2Label.setAttribute("y", P2.y * 200 + 200 - 10);
  p2Label.textContent = `(${P2.x.toFixed(2)}, ${P2.y.toFixed(2)})`;
}

function bezierY(t) {
  return (
    Math.pow(1 - t, 3) * P0.y +
    3 * Math.pow(1 - t, 2) * t * P1.y +
    3 * (1 - t) * Math.pow(t, 2) * P2.y +
    Math.pow(t, 3) * P3.y
  );
}

function findTForX(x) {
  const steps = 1000;
  let t = 0;
  let closestX = 0;
  let closestT = 0;

  for (let i = 0; i <= steps; i++) {
    t = i / steps;
    const currentX =
      Math.pow(1 - t, 3) * P0.x +
      3 * Math.pow(1 - t, 2) * t * P1.x +
      3 * (1 - t) * Math.pow(t, 2) * P2.x +
      Math.pow(t, 3) * P3.x;
    if (Math.abs(currentX - x) < Math.abs(closestX - x)) {
      closestX = currentX;
      closestT = t;
    }
  }
  return closestT;
}

function getAnimationProgress(x) {
  const t = findTForX(x);
  return bezierY(t);
}

function animate() {
  const box = document.getElementById("box");
  const duration = 1000;
  const startTime = performance.now();

  function update() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const x = progress;
    const y = getAnimationProgress(x);

    const maxDistance = window.innerWidth * 0.8;
    const minDistance = window.innerWidth * 0.2;
    box.style.left = `${minDistance + y * (maxDistance - minDistance)}px`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

let dragging = null;

svg.addEventListener("mousedown", (e) => {
  const rect = svg.getBoundingClientRect();
  const x = (e.clientX - rect.left - 200) / 200;
  const y = (e.clientY - rect.top - 200) / 200;

  if (Math.abs(x - P1.x) < 0.05 && Math.abs(y - P1.y) < 0.05) {
    dragging = "P1";
  } else if (Math.abs(x - P2.x) < 0.05 && Math.abs(y - P2.y) < 0.05) {
    dragging = "P2";
  }
});

svg.addEventListener("mousemove", (e) => {
  if (dragging) {
    const rect = svg.getBoundingClientRect();
    let x = (e.clientX - rect.left - 200) / 200;
    let y = (e.clientY - rect.top - 200) / 200;

    x = Math.max(0, Math.min(1, x));

    if (dragging === "P1") {
      P1.x = x;
      P1.y = y;
    } else if (dragging === "P2") {
      P2.x = x;
      P2.y = y;
    }

    updateGraph();
    animate();
  }
});

svg.addEventListener("mouseup", () => {
  dragging = null;
});

svg.addEventListener("mouseleave", () => {
  dragging = null;
});

updateGraph();
animate();
