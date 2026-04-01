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

  if (expected.type === "decimal") {
  return Math.abs((user.num / user.den) - parseFloat(expected.value)) < 1e-9;
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
 * CURVEBALL 6 — REFLECTION ACROSS LINE (ALL 4 CASES)
 ****************************************************/
function generateCurveball6() {
  const p = randInt(-20, 20);
  const q = randInt(-20, 20);

  const slope = Math.random() < 0.5 ? 1 : -1;
  const c = randInt(-10, 10);

  const askHK = Math.random() < 0.5;

  let text, answer;

  if (slope === -1) {
    // y = -x + c
    if (askHK) {
      // h + k = -p - q + 2c
      const val = -p - q + 2 * c;
      text = `The point (${p}, ${q}) is reflected across the line \\(y = -x ${c>=0?'+':''}${c}\\). Find \\(h+k\\).`;
      answer = { type: "int", value: val };
    } else {
      // h - k = p - q
      const val = p - q;
      text = `The point (${p}, ${q}) is reflected across the line \\(y = -x ${c>=0?'+':''}${c}\\). Find \\(h-k\\).`;
      answer = { type: "int", value: val };
    }
  } else {
    // y = x + c
    if (!askHK) {
      // h - k = -p + q + 2c
      const val = -p + q + 2 * c;
      text = `The point (${p}, ${q}) is reflected across the line \\(y = x ${c>=0?'+':''}${c}\\). Find \\(h-k\\).`;
      answer = { type: "int", value: val };
    } else {
      // h + k = p + q
      const val = p + q;
      text = `The point (${p}, ${q}) is reflected across the line \\(y = x ${c>=0?'+':''}${c}\\). Find \\(h+k\\).`;
      answer = { type: "int", value: val };
    }
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
<p><strong>For the line</strong> \\(y = -x + c\\):</p>
<ul>
  <li>\\(h+k = -p - q + 2c\\)</li>
  <li>\\(h-k = p - q\\)</li>
</ul>

<p><strong>For the line</strong> \\(y = x + c\\):</p>
<ul>
  <li>\\(h-k = -p + q + 2c\\)</li>
  <li>\\(h+k = p + q\\)</li>
</ul>
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

function generateQ1() {
  const form = randInt(1, 3);

  if (form === 1) {
    // abcd + efgh, no carry in tens/ones
    const a = randInt(1, 9);
    const b = randInt(0, 9);
    const c = randInt(0, 9);
    const d = randInt(0, 4);

    const e = randInt(1, 9);
    const f = randInt(0, 9);
    const g = randInt(0, 9);
    const h = randInt(0, 4);

    if (d + h >= 10 || c + g >= 10) return generateQ1();

    const n1 = 1000 * a + 100 * b + 10 * c + d;
    const n2 = 1000 * e + 100 * f + 10 * g + h;
    return {
      text: `${n1} + ${n2} =`,
      answer: { type: "int", value: n1 + n2 }
    };
  }

  if (form === 2) {
    // abcd + efg + hij, no carry in tens/ones
    const a = randInt(1, 9);
    const b = randInt(0, 9);
    const c = randInt(0, 4);
    const d = randInt(0, 4);

    const e = randInt(1, 9);
    const f = randInt(0, 9);
    const g = randInt(0, 4);

    const h = randInt(1, 9);
    const i = randInt(0, 9);
    const j = randInt(0, 4);

    if (d + g + j >= 10 || c + f + i >= 10) return generateQ1();

    const n1 = 1000 * a + 100 * b + 10 * c + d;
    const n2 = 100 * e + 10 * f + g;
    const n3 = 100 * h + 10 * i + j;
    return {
      text: `${n1} + ${n2} + ${n3} =`,
      answer: { type: "int", value: n1 + n2 + n3 }
    };
  }

  // form 3: abcd - efg, no borrow in tens/ones
  const A = randInt(2, 9);
  const B = randInt(0, 9);
  const C = randInt(2, 9);
  const D = randInt(2, 9);

  const E = randInt(1, A - 1);
  const F = randInt(0, 9);
  const G = randInt(0, 9);

  const n1 = 1000 * A + 100 * B + 10 * C + D;
  const n2 = 100 * E + 10 * F + G;

  if (D < G || C < F) return generateQ1();

  return {
    text: `${n1} - ${n2} =`,
    answer: { type: "int", value: n1 - n2 }
  };
}

function generateQ2() {
  const form = randInt(1, 3);

  if (form === 1) {
    // abc.de + fg.hi
    const abc = randInt(10, 999);
    const fg = randInt(10, 999);
    const de = randInt(10, 99);
    const hi = randInt(10, 99);

    const n1 = abc + de / 100;
    const n2 = fg + hi / 100;

    return {
      text: `${n1.toFixed(2)} + ${n2.toFixed(2)} =`,
      answer: { type: "decimal", value: (n1 + n2).toFixed(2) }
    };
  }

  if (form === 2) {
    // abc.de - fg.hi with no borrow
    const abc = randInt(50, 999);
    const fg = randInt(10, abc - 1);
    const de = randInt(10, 99);
    const hi = randInt(10, 99);

    if (de < hi) return generateQ2();

    const n1 = abc + de / 100;
    const n2 = fg + hi / 100;

    return {
      text: `${n1.toFixed(2)} - ${n2.toFixed(2)} =`,
      answer: { type: "decimal", value: (n1 - n2).toFixed(2) }
    };
  }

  // form 3: ab.cde + c.de
  const ab = randInt(10, 99);
  const c = randInt(1, 9);
  const de = randInt(10, 99);

  const n1 = ab + c / 10 + de / 1000;
  const n2 = c + de / 100;

  return {
    text: `${n1.toFixed(3)} + ${n2.toFixed(2)} =`,
    answer: { type: "decimal", value: (n1 + n2).toFixed(3) }
  };
}

function generateQ3() {
  const form = randInt(1, 4);

  function makeFracCancel() {
    const b = randInt(2, 12);
    const k = randInt(2, 9);
    const a = k;
    const d = b * k;
    return { a, b, c: randInt(2, 12), d };
  }

  if (form === 1) {
    // (a/b) × (c/d) with a|d
    const b = randInt(2, 12);
    const a = randInt(2, 9);
    const k = randInt(2, 5);
    const d = a * k;
    const c = randInt(2, 12);

    const num = a * c;
    const den = b * d;
    const simp = simplifyFraction(num, den);

    return {
      text: `\\( \\frac{${a}}{${b}} \\times \\frac{${c}}{${d}} = \\)`,
      answer: { type: "frac", value: simp }
    };
  }

  if (form === 2) {
    // (a/b) × (c/d) with b|c
    const b = randInt(2, 12);
    const k = randInt(2, 5);
    const c = b * k;
    const a = randInt(2, 9);
    const d = randInt(2, 12);

    const num = a * c;
    const den = b * d;
    const simp = simplifyFraction(num, den);

    return {
      text: `\\( \\frac{${a}}{${b}} \\times \\frac{${c}}{${d}} = \\)`,
      answer: { type: "frac", value: simp }
    };
  }

  if (form === 3) {
    // (a/b) ÷ (c/d) with a|c
    const b = randInt(2, 12);
    const a = randInt(2, 9);
    const k = randInt(2, 5);
    const c = a * k;
    const d = randInt(2, 12);

    const num = a * d;
    const den = b * c;
    const simp = simplifyFraction(num, den);

    return {
      text: `\\( \\frac{${a}}{${b}} \\div \\frac{${c}}{${d}} = \\)`,
      answer: { type: "frac", value: simp }
    };
  }

  // form 4: (a/b) × (b/a) = 1
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  return {
    text: `\\( \\frac{${a}}{${b}} \\times \\frac{${b}}{${a}} = \\)`,
    answer: { type: "int", value: 1 }
  };
}

function generateQ4() {
  const form = randInt(1, 3);

  function toImproper(A, B, C) {
    return { num: A * C + B, den: C };
  }

  if (form === 1) {
    // (A 1/2) × (B 1/2)
    const A = randInt(2, 15);
    const B = randInt(2, 15);
    const f1 = toImproper(A, 1, 2); // (2A+1)/2
    const f2 = toImproper(B, 1, 2); // (2B+1)/2

    const num = f1.num * f2.num;
    const den = 4;
    const simp = simplifyFraction(num, den);

    return {
      text: `${A} \\(\\frac{1}{2}\\) × ${B} \\(\\frac{1}{2}\\) =`,
      answer: { type: "frac", value: simp }
    };
  }

  if (form === 2) {
    // (A 3/5) × (A 2/5)
    const A = randInt(2, 12);
    const f1 = toImproper(A, 3, 5);
    const f2 = toImproper(A, 2, 5);

    const num = f1.num * f2.num;
    const den = 25;
    const simp = simplifyFraction(num, den);

    return {
      text: `${A} \\(\\frac{3}{5}\\) × ${A} \\(\\frac{2}{5}\\) =`,
      answer: { type: "frac", value: simp }
    };
  }

  // form 3: (A 2/3) × B with B multiple of 3
  const A = randInt(2, 15);
  const B = 3 * randInt(2, 10);
  const f = toImproper(A, 2, 3); // (3A+2)/3

  const num = f.num * B;
  const den = 3;
  const simp = simplifyFraction(num, den);

  return {
    text: `${A} \\(\\frac{2}{3}\\) × ${B} =`,
    answer: { type: "frac", value: simp }
  };
}

function generateQ5() {
  const form = randInt(1, 2);

  if (form === 1) {
    // Sum from X to Y
    const X = randInt(3, 15);
    const Y = X +  randInt(5, 15);
    const n = Y - X + 1;
    const sum = n * (X + Y) / 2;

    return {
      text: `Find the sum of the integers from ${X} to ${Y}, inclusive.`,
      answer: { type: "int", value: sum }
    };
  }

  // form 2: a, a+d, ..., a+nd
  const a = randInt(3, 20);
  const d = randInt(1, 5);
  const n = randInt(4, 10);
  const last = a + n * d;
  const sum = (n + 1) * (a + last) / 2;

  return {
    text: `Find the sum: ${a}, ${a + d}, ${a + 2 * d}, ..., ${last}.`,
    answer: { type: "int", value: sum }
  };
}

function generateQ6() {
  const form = randInt(1, 3);

  if (form === 1) {
    // a.bcd is __% of N
    const N = randInt(100, 999);
    const p = randInt(2, 30); // percent
    const val = N * p / 100;
    const scaled = (val * 100) | 0;
    const display = (scaled / 100).toFixed(2);

    return {
      text: `${display} is what percent of ${N}?`,
      answer: { type: "int", value: p }
    };
  }

  if (form === 2) {
    // __% of N is M
    const N = randInt(50, 500);
    const p = randInt(5, 40);
    const M = N * p / 100;

    return {
      text: `What percent of ${N} is ${M}?`,
      answer: { type: "int", value: p }
    };
  }

  // form 3: (a-b) + 2×(1+2):3! style
  const a = randInt(5, 15);
  const b = randInt(1, 5);
  const c = randInt(1, 4);
  const d = randInt(1, 4);
  const fact = randInt(3, 5);

  let f = 1;
  for (let i = 2; i <= fact; i++) f *= i;

  const val = (a - b) + 2 * (c + d) / f;

  return {
    text: `(${a} - ${b}) + 2 × (${c} + ${d}) : ${fact}! =`,
    answer: { type: "int", value: val }
  };
}

function generateQ7() {
  const form = randInt(1, 3);

  if (form === 1) {
    const a = randInt(5, 15);
    const b = randInt(1, 5);
    const c = randInt(2, 6);
    const d = randInt(1, 5);
    const e = randInt(1, 5);

    const val = (a - b) + c * (d + e);
    return {
      text: `(${a} - ${b}) + ${c} × (${d} + ${e}) =`,
      answer: { type: "int", value: val }
    };
  }

  if (form === 2) {
    const a = randInt(3, 9);
    const b = randInt(1, a - 1);
    const val = a * a - b * b;
    return {
      text: `${a}² - ${b}² =`,
      answer: { type: "int", value: val }
    };
  }

  // form 3: (a+b)² - (a-b)² = 4ab
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const val = 4 * a * b;
  return {
    text: `(${a} + ${b})² - (${a} - ${b})² =`,
    answer: { type: "int", value: val }
  };
}

function generateQ8() {
  const form = randInt(1, 3);

  if (form === 1) {
    const a = randInt(10, 60);
    const b = randInt(10, 60);
    const g = gcd(a, b);
    const l = (a * b) / g;
    return {
      text: `GCD(${a}, ${b}) + LCM(${a}, ${b}) =`,
      answer: { type: "int", value: g + l }
    };
  }

  if (form === 2) {
    // sum of divisors of n where n is small
    const n = randInt(10, 60);
    let sum = 0;
    for (let d = 1; d <= n; d++) if (n % d === 0) sum += d;
    return {
      text: `Find the sum of the positive divisors of ${n}.`,
      answer: { type: "int", value: sum }
    };
  }

  // form 3: product of divisors of n (n is perfect square or prime power)
  const p = [2, 3, 5, 7, 11][randInt(0, 4)];
  const k = randInt(2, 4);
  const n = p ** k;
  // product of divisors of p^k is p^{k·2^{k-1}}
  const numDiv = k + 1;
  const exponent = (numDiv / 2) * n; // but this gets huge; keep k small
  // Instead, we can just compute directly:
  let prod = 1n;
  for (let d = 1; d <= n; d++) {
    if (n % d === 0) prod *= BigInt(d);
  }

  return {
    text: `Find the product of the positive divisors of ${n}.`,
    answer: { type: "int", value: Number(prod) } // careful: may overflow; keep n small
  };
}

function generateQ9() {
  const form = randInt(1, 2);

  if (form === 1) {
    const d = randInt(7, 25);
    const q = randInt(2, 15);
    const r = randInt(1, d - 1);
    const n = d * q + r;

    return {
      text: `${n} ÷ ${d} = (mixed number)`,
      answer: { type: "frac", value: { num: n, den: d } }
    };
  }

  // form 2: abc : de with small remainder
  const d = randInt(7, 30);
  const q = randInt(2, 20);
  const r = randInt(1, 9);
  const n = d * q + r;

  return {
    text: `${n} ÷ ${d} = (mixed number)`,
    answer: { type: "frac", value: { num: n, den: d } }
  };
}

function generateQ10() {
  const form = randInt(1, 2);

  if (form === 1) {
    // abcd × ef + ghij
    const abcd = randInt(2000, 9000);
    const ef = randInt(12, 49);
    const ghij = randInt(1000, 9000);

    const exact = abcd * ef + ghij;

    return {
      text: `\\( ${abcd} \\times ${ef} + ${ghij} \\)`,
      answer: { type: "int", value: exact } // you'll treat as starred approx in UI
    };
  }

  // form 2: abcd × (ef + gh)
  const abcd = randInt(2000, 9000);
  const ef = randInt(20, 60);
  const gh = randInt(20, 60);
  const sum = ef + gh;
  const exact = abcd * sum;

  return {
    text: `\\( ${abcd} \\times (${ef} + ${gh}) \\)`,
    answer: { type: "int", value: exact }
  };
}

function generateQ11() {
  // 1 + 3 × (6 - 10) + (15 - 21) style
  const a = randInt(1, 5);
  const b = randInt(2, 6);
  const c = randInt(6, 12);
  const d = c + randInt(2, 5);
  const e = randInt(10, 20);
  const f = e + randInt(3, 8);

  const val = a + b * (c - d) + (e - f);
  return {
    text: `${a} + ${b} × (${c} - ${d}) + (${e} - ${f}) =`,
    answer: { type: "int", value: val }
  };
}

function generateQ12() {
  // 124 × 13 style: (100a + b) × (10 + c)
  const a = randInt(1, 9);
  const b = randInt(20, 49); // keeps it "124-ish"
  const c = randInt(2, 5);
  const n1 = 100 * a + b;
  const n2 = 10 + c;
  return {
    text: `${n1} × ${n2} =`,
    answer: { type: "int", value: n1 * n2 }
  };
}

function generateQ13() {
  // 222 × 37 style: rep-digit × (30+7)
  const d = [2, 3, 4][randInt(0, 2)];
  const rep = 111 * d; // 222, 333, 444
  const k = randInt(3, 5); // 3x+7
  const n2 = 10 * k + 7;
  return {
    text: `${rep} × ${n2} =`,
    answer: { type: "int", value: rep * n2 }
  };
}

function generateQ14() {
  // k% of N is
  const k = randInt(5, 40);
  const N = 25 * randInt(4, 40); // multiple of 25
  const val = N * k / 100;
  return {
    text: `${k}% of ${N} is`,
    answer: { type: "int", value: val }
  };
}

function generateQ15() {
  // a^2 - b^2 = m x, with nice factorization
  const a = randInt(10, 25);
  const diff = [2, 4, 6][randInt(0, 2)];
  const b = a + diff;
  const m = randInt(2, 6);

  const lhs = a * a - b * b; // (a-b)(a+b)
  const x = lhs / m;

  return {
    text: `${a}² - ${b}² = ${m}x`,
    answer: { type: "int", value: x }
  };
}

function generateQ16() {
  // abcd × 4 + 16 style
  const base = 25 * randInt(40, 120); // multiple of 25
  const val = base * 4 + 16;
  return {
    text: `${base} × 4 + 16 =`,
    answer: { type: "int", value: val }
  };
}

function generateQ17() {
  // metric grams ↔ ounces with prefixes, using 25 g ≈ 1 oz
  const prefixes = [
    { name: "centigrams", factor: 0.01 },
    { name: "decigrams", factor: 0.1 },
    { name: "grams", factor: 1 },
    { name: "dekagrams", factor: 10 }
  ];
  const p = prefixes[randInt(0, prefixes.length - 1)];

  // choose a "given" metric amount that converts to a nice decimal oz
  const metric1 = 2 * randInt(1, 5); // 2,4,6,8,10 units
  const grams1 = metric1 * p.factor;
  const oz1 = grams1 / 25; // using 25 g per oz

  const oz2 = 2 * randInt(3, 8); // 6,8,10,...,16 oz
  const grams2 = oz2 * 25;
  const metric2 = grams2 / p.factor;

  return {
    text: `${metric1} ${p.name} = ${oz1.toFixed(2)} oz and ${oz2} oz =`,
    answer: { type: "decimal", value: metric2.toString() }
  };
}

function generateQ18() {
  // If a items cost $b.cc, what will n items cost?
  const a = randInt(3, 7);
  const pricePer = randInt(150, 450) / 100; // $1.50–$4.50
  const totalA = a * pricePer;
  const n = randInt(8, 15);

  const totalN = n * pricePer;
  return {
    text: `If ${a} medals cost $${totalA.toFixed(2)}, what will ${n} medals cost? $`,
    answer: { type: "decimal", value: totalN.toFixed(2) }
  };
}

function generateQ19() {
  // sum of LCM and GCD of two numbers
  const a = randInt(12, 40);
  const b = randInt(12, 40);
  const g = gcd(a, b);
  const l = (a * b) / g;
  return {
    text: `The sum of the LCM of ${a} and ${b} and the GCD of ${a} and ${b} is`,
    answer: { type: "int", value: g + l }
  };
}

function generateQ20() {
  // * starred: ab × cd + efg, cap at 500,000
  let ab, cd, efg, exact;
  while (true) {
    ab = randInt(120, 450);
    cd = randInt(120, 450);
    efg = randInt(500, 5000);
    exact = ab * cd + efg;
    if (exact <= 500000) break;
  }

  return {
    text: `\\( ${ab} \\times ${cd} + ${efg} \\)`,
    answer: { type: "int", value: exact } // treat as starred approx in scoring
  };
}



function generateQuestion(n) {
  return questionGenerators[n]();
}

const questionGenerators = {
  1: generateQ1,
  2: generateQ2,
  3: generateQ3,
  4: generateQ4,
  5: generateQ5,
  6: generateQ6,
  7: generateQ7,
  8: generateQ8,
  9: generateQ9,
  10: generateQ10,
  11: generateQ11,
  12: generateQ12,
  13: generateQ13,
  14: generateQ14,
  15: generateQ15,
  16: generateQ16,
  17: generateQ17,
  18: generateQ18,
  19: generateQ19,
  20: generateQ20
};


/****************************************************
 * UIL TEST GENERATOR (1–80)
 ****************************************************/
function buildProblemText(n) {
  // If we have a generator for this question, use it.
  if (questionGenerators[n]) {
    const q = questionGenerators[n]();
    return {
      text: q.text,
      answer: q.answer
    };
  }

  // Placeholder for not-yet-implemented questions
  return {
    text: "Problem not yet implemented.",
    answer: null
  };
}

function formatAnswer(n, ans) {
  if (!ans) return `(not implemented)`;
  if (ans.type === "int") return `${ans.value}`;
  if (ans.type === "frac") {
    const s = simplifyFraction(ans.value.num, ans.value.den);
    if (s.den === 1) return `${s.num}`;
    return `${s.num}/${s.den}`;
  }
  if (ans.type === "decimal") return ans.value;
  return `?`;
}

function generateFullTest() {
  const ranges = {
    "col-1-17": [1, 17],
    "col-18-34": [18, 34],
    "col-35-56": [35, 56],
    "col-57-80": [57, 80]
  };

  const starred = [10, 20, 30, 40, 50, 60, 70, 80];
  const label = starred.includes(n) ? `*(${n})` : `(${n})`;

  const answerKey = [];

  Object.entries(ranges).forEach(([id, [start, end]]) => {
    const col = document.getElementById(id);
    col.innerHTML = "";
    for (let n = start; n <= end; n++) {
      const { text, answer } = buildProblemText(n);
      const div = document.createElement("div");
      div.className = "uil-problem";
      div.innerHTML = `
        <span class="uil-problem-number">(${n})</span> 
        <span class="uil-problem-text">${text}</span>
        <span class="uil-blank"></span>
      `;

      col.appendChild(div);

      answerKey.push({
        n,
        ans: formatAnswer(n, answer)
      });
    }
  });

  // Build answer key display
  const ak = document.getElementById("answer-key-list");
  ak.innerHTML = "";
  answerKey.forEach(item => {
    const div = document.createElement("div");
    div.className = "answer-key-item";
    div.textContent = `(${item.n}) ${item.ans}`;
    ak.appendChild(div);
  });
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

  // NEW: test generator buttons
  document.getElementById("generate-test")?.addEventListener("click", () => {
    generateFullTest();
    renderMath();
  });

  document.getElementById("print-test")?.addEventListener("click", () => {
    window.print();
  });

  document.getElementById("toggle-answer-key")?.addEventListener("click", () => {
    const ak = document.getElementById("answer-key");
    ak.classList.toggle("hidden");
  });

  newProblem();
});

