/****************************************************
 * UTILITIES
 ****************************************************/
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyFraction(num, den) {
  if (den < 0) { num = -num; den = -den; }
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

function parseFraction(str) {
  const s = str.trim();
  if (s.includes("/")) {
    const [a, b] = s.split("/");
    const num = parseInt(a, 10);
    const den = parseInt(b, 10);
    if (isNaN(num) || isNaN(den) || den === 0) return null;
    return simplifyFraction(num, den);
  } else {
    const num = parseFloat(s);
    if (isNaN(num)) return null;
    return { num, den: 1 };
  }
}

function equalAnswers(expected, user) {
  if (!user) return false;

  if (expected.type === "int") {
    return Math.abs(user.num / user.den - expected.value) < 1e-9;
  }

  if (expected.type === "frac") {
    const e = simplifyFraction(expected.value.num, expected.value.den);
    const u = simplifyFraction(user.num, user.den);
    return e.num === u.num && e.den === u.den;
  }

  return false;
}

function renderMath() {
  if (window.MathJax) MathJax.typeset();
}

/****************************************************
 * CURVEBALL 1 — FRACTION TRICK
 ****************************************************/
function generateCurveball1(type = null) {
  if (!type) type = Math.random() < 0.5 ? "A" : "B";

  while (true) {
    const a = randInt(2, 20);
    const b = randInt(2, 20);
    const n = randInt(2, 6);

    if (type === "A") {
      const den2 = n * b + 1;
      if (den2 <= 0 || den2 > 200) continue;
      const num2 = n * a - 1;

      const baseAns = { num: a + b, den: b * den2 };
      const fracSimple = { num: a, den: b };
      const fracUgly = { num: num2, den: den2 };

      let left, right, ans;
      if (Math.random() < 0.5) {
        left = fracSimple; right = fracUgly; ans = baseAns;
      } else {
        left = fracUgly; right = fracSimple;
        ans = { num: -baseAns.num, den: baseAns.den };
      }

      return {
        text: `\\( \\frac{${left.num}}{${left.den}} - \\frac{${right.num}}{${right.den}} = \\)`,
        answer: { type: "frac", value: ans }
      };
    }

    else {
      const den2 = n * b - 1;
      if (den2 <= 0 || den2 > 200) continue;
      const num2 = n * a + 1;

      const baseAns = { num: -(a + b), den: b * den2 };
      const fracSimple = { num: a, den: b };
      const fracUgly = { num: num2, den: den2 };

      let left, right, ans;
      if (Math.random() < 0.5) {
        left = fracSimple; right = fracUgly; ans = baseAns;
      } else {
        left = fracUgly; right = fracSimple;
        ans = { num: -baseAns.num, den: baseAns.den };
      }

      return {
        text: `\\( \\frac{${left.num}}{${left.den}} - \\frac{${right.num}}{${right.den}} = \\)`,
        answer: { type: "frac", value: ans }
      };
    }
  }
}

/****************************************************
 * CURVEBALL 2 — PERMUTATIONS & INEQUALITIES
 ****************************************************/
function permutations(arr, k) {
  if (k === 0) return [[]];
  let result = [];
  arr.forEach((d, i) => {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    permutations(rest, k - 1).forEach(p => {
      result.push([d].concat(p));
    });
  });
  return result;
}

function digitsToNumber(digs) {
  return parseInt(digs.join(""), 10);
}

function generateCurveball2() {
  const size = randInt(3, 6);
  let digits = [];
  while (digits.length < size) {
    const d = randInt(1, 9);
    if (!digits.includes(d)) digits.push(d);
  }
  digits.sort((a, b) => a - b);

  const k = randInt(2, Math.min(5, size));
  const minN = Math.pow(10, k - 1);
  const maxN = Math.pow(10, k) - 1;
  const N = randInt(minN, maxN);

  const ops = ["<", ">", "<=", ">="];
  const op = ops[randInt(0, ops.length - 1)];

  const perms = permutations(digits, k);
  let count = 0;
  perms.forEach(p => {
    const num = digitsToNumber(p);
    if (
      (op === "<"  && num <  N) ||
      (op === ">"  && num >  N) ||
      (op === "<=" && num <= N) ||
      (op === ">=" && num >= N)
    ) count++;
  });

  return {
    text: `How many ${k}-digit numbers ${op} ${N} can be made using digits ${digits.join(", ")}?`,
    answer: { type: "int", value: count }
  };
}

/****************************************************
 * CURVEBALL 3 — DIGIT SUM
 ****************************************************/
function triangular(n) {
  return n * (n + 1) / 2;
}

function countDigitSum3(S) {
  if (S <= 9) return triangular(S);
  if (S <= 18) return 70 - Math.pow(14 - S, 2);
  return triangular(28 - S);
}

function generateCurveball3() {
  const S = randInt(1, 27);
  const ans = countDigitSum3(S);
  return {
    text: `The sum of the digits of a 3-digit number is ${S}. How many such numbers exist?`,
    answer: { type: "int", value: ans }
  };
}

/****************************************************
 * CURVEBALL 4 — PRODUCT ∏
 ****************************************************/
function generateCurveball4() {
  const a = randInt(1, 5);
  const b = a + randInt(3, 5);
  const types = ["n-k", "k-n"];
  const type = types[randInt(0, types.length - 1)];
  const k = randInt(1, 4);

  let product = 1;
  for (let n = a; n <= b; n++) {
    let val = (type === "n-k") ? (n - k) : (k - n);
    product *= val;
  }

  const expr = (type === "n-k") ? `(n-${k})` : `(${k}-n)`;

  return {
    text: `\\( \\prod_{n=${a}}^{${b}} ${expr} \\)`,
    answer: { type: "int", value: product }
  };
}

/****************************************************
 * CURVEBALL 5 — nPr / nCr RELATION
 ****************************************************/
function factorial(n) {
  let p = 1;
  for (let i = 2; i <= n; i++) p *= i;
  return p;
}

function generateCurveball5() {
  const n = randInt(5, 12);
  const r = randInt(1, Math.min(4, n - 1));
  const forms = ["A", "B", "C"];
  const form = forms[randInt(0, forms.length - 1)];
  const rf = factorial(r);

  const nPr = `${n}P_{${r}}`;
  const nCr = `${n}C_{${r}}`;
  const nCnr = `${n}C_{${n - r}}`;

  let text, ans;

  if (form === "A") {
    text = `\\( ${nPr} = k \\cdot ${nCr} \\)`;
    ans = rf;
  } 
  else if (form === "B") {
    text = `\\( k \\cdot ${nPr} = ${nCr} \\)`;
    ans = 1 / rf;
  } 
  else {
    text = `\\( ${nPr} = k \\cdot ${nCnr} \\)`;
    ans = rf;
  }

  return {
    text,
    answer: { type: "int", value: ans }
  };
}

/****************************************************
 * CURVEBALL 6 — REFLECTION ACROSS LINE
 ****************************************************/
function generateCurveball6() {
  const p = randInt(-20, 20);
  const q = randInt(-20, 20);

  const slope = Math.random() < 0.5 ? 1 : -1;
  const c = randInt(-10, 10);

  const askHK = Math.random() < 0.5;

  let text, answer;

  if (slope === -1) {
    const val = -p - q + 2 * c;

    text = `The point (${p}, ${q}) is reflected across the line \\(y = -x ${c>=0?'+':''}${c}\\). Find \\(h+k\\).`;
    answer = { type: "int", value: val };
  }

  else {
    const val = -p + q + 2 * c;

    text = `The point (${p}, ${q}) is reflected across the line \\(y = x ${c>=0?'+':''}${c}\\). Find \\(h-k\\).`;
    answer = { type: "int", value: val };
  }

  return { text, answer };
}

/****************************************************
 * REGISTRY
 ****************************************************/
const generators = {
  1: generateCurveball1,
  2: generateCurveball2,
  3: generateCurveball3,
  4: generateCurveball4,
  5: generateCurveball5,
  6: generateCurveball6
};

let currentProblem = null;

/****************************************************
 * PRACTICE MODE
 ****************************************************/
function newProblem() {
  const mode = document.getElementById("curveball-select").value;

  let gen;
  if (mode === "mix") {
    const keys = Object.keys(generators);
    const k = keys[randInt(0, keys.length - 1)];
    gen = generators[k];
  } else {
    gen = generators[mode];
  }

  currentProblem = gen();
  document.getElementById("problem-text").innerHTML = currentProblem.text;
  renderMath();

  document.getElementById("answer-input").value = "";
  const fb = document.getElementById("feedback");
  fb.textContent = "";
  fb.className = "";
}

function checkAnswer() {
  if (!currentProblem) return;

  const raw = document.getElementById("answer-input").value;
  const parsed = parseFraction(raw);
  const ok = equalAnswers(currentProblem.answer, parsed);

  const fb = document.getElementById("feedback");

  if (ok) {
    fb.textContent = "Correct.";
    fb.className = "correct";

    setTimeout(newProblem, 300);
  } else {
    fb.textContent = "Incorrect.";
    fb.className = "incorrect";
  }
}

/****************************************************
 * EXPLANATIONS TAB
 ****************************************************/
const explanations = `
<h2>Fraction Trick</h2>
<p>\\( \\frac{a}{b} - \\frac{na-1}{nb+1} = \\frac{a+b}{b(nb+1)} \\)</p>
<p>\\( \\frac{a}{b} - \\frac{na+1}{nb-1} = -\\frac{a+b}{b(nb-1)} \\)</p>

<h2>Permutation Inequality</h2>
<p>Count all permutations of the digits, then filter by the inequality.</p>

<h2>Digit Sum Parabola</h2>
<p>Use triangular numbers and the middle parabola formula.</p>

<h2>Shifted Product</h2>
<p>Expand the product; it always becomes a shifted factorial.</p>

<h2>nPr / nCr Ratio</h2>
<p>\\( nP r = r! \\cdot nC r \\)</p>

<h2>Reflection Across Line</h2>
<p>For \\(y = -x + c\\): \\(h+k = -p - q + 2c\\).</p>
<p>For \\(y = x + c\\): \\(h-k = -p + q + 2c\\).</p>
`;

function loadExplanations() {
  document.getElementById("explanation-content").innerHTML = explanations;
  renderMath();
}

/****************************************************
 * TIMED MODE
 ****************************************************/
let timer = null;
let timeLeft = 120;
let timedScore = 0;
let timedProblem = null;
let timedGenerators = [];

function startTimed() {
  timedGenerators = [];
  document.querySelectorAll(".cb").forEach(cb => {
    if (cb.checked) timedGenerators.push(cb.value);
  });

  if (timedGenerators.length === 0) {
    alert("Select at least one curveball.");
    return;
  }

  timedScore = 0;
  timeLeft = 120;

  document.getElementById("timed-area").style.display = "block";
  nextTimedProblem();

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `${Math.floor(timeLeft/60)}:${String(timeLeft%60).padStart(2,"0")}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("timed-feedback").textContent = "Time's up!";
    }
  }, 1000);
}

function nextTimedProblem() {
  const key = timedGenerators[randInt(0, timedGenerators.length - 1)];
  timedProblem = generators[key]();

  document.getElementById("timed-problem").innerHTML = timedProblem.text;
  renderMath();

  document.getElementById("timed-answer").value = "";
  document.getElementById("timed-feedback").textContent = "";
}

function submitTimed() {
  if (!timedProblem) return;

  const raw = document.getElementById("timed-answer").value;
  const parsed = parseFraction(raw);
  const ok = equalAnswers(timedProblem.answer, parsed);

  const fb = document.getElementById("timed-feedback");

  if (ok) {
    timedScore++;
    fb.textContent = "Correct.";
    fb.className = "correct";
    document.getElementById("timed-score").textContent = `Score: ${timedScore}`;
    nextTimedProblem();
  } else {
    fb.textContent = "Incorrect.";
    fb.className = "incorrect";
  }
}

/****************************************************
 * TAB SWITCHING
 ****************************************************/
function switchTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  document.querySelector(`.tab-button[data-tab="${tab}"]`).classList.add("active");

  if (tab === "explanations") loadExplanations();
}

/****************************************************
 * EVENT LISTENERS
 ****************************************************/
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("new-problem")?.addEventListener("click", newProblem);
  document.getElementById("check-answer").addEventListener("click", checkAnswer);
  document.getElementById("answer-input").addEventListener("keydown", e => {
    if (e.key === "Enter") checkAnswer();
  });

  document.getElementById("curveball-select").addEventListener("change", newProblem);

  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("start-timed").addEventListener("click", startTimed);
  document.getElementById("timed-submit").addEventListener("click", submitTimed);
  document.getElementById("timed-answer").addEventListener("keydown", e => {
    if (e.key === "Enter") submitTimed();
  });

  newProblem();
});
