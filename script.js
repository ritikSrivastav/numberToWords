// ---- JavaScript for a dynamic Indian Number to Words converter ----

// Basic arrays for numbers 0–19 and the tens (20, 30, 40, ... 90)
const ONES = [
  "", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
  "eighteen", "nineteen"
];

const TENS_MULTIPLE = [
  "", "", "twenty", "thirty", "forty", "fifty",
  "sixty", "seventy", "eighty", "ninety"
];

// Converts an integer 0–99 into words
function twoDigitWords(num) {
  if (num < 20) {
    return ONES[num];
  } else {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    if (ones === 0) {
      return TENS_MULTIPLE[tens];
    } else {
      return TENS_MULTIPLE[tens] + " " + ONES[ones];
    }
  }
}

// Converts an integer 0–999 into words
function threeDigitWords(num) {
  if (num === 0) return "";

  const hundredPart = Math.floor(num / 100);
  const remainder = num % 100;

  let result = "";
  if (hundredPart > 0) {
    result += ONES[hundredPart] + " hundred";
    if (remainder > 0) {
      result += " ";
      // optional: result += "and ";
    }
  }
  if (remainder > 0) {
    result += twoDigitWords(remainder);
  }
  return result;
}

/**
 * Converts a non-negative BigInt into a string following
 * the extended Indian numbering system up to 'shankh' (10^17):
 *  - shankh  = 10^17
 *  - padma   = 10^15
 *  - neel    = 10^13
 *  - kharab  = 10^11
 *  - arab    = 10^9
 *  - crore   = 10^7
 *  - lakh    = 10^5
 *  - thousand= 10^3
 *  - hundred = 10^2
 */
function numberToIndianWords(num) {
  if (num === 0n) {
    return "zero";
  }

  // Denominations as BigInt constants
  const SHANKH   = 100000000000000000n; // 10^17
  const PADMA    = 1000000000000000n;   // 10^15
  const NEEL     = 10000000000000n;     // 10^13
  const KHARAB   = 100000000000n;       // 10^11
  const ARAB     = 1000000000n;         // 10^9
  const CRORE    = 10000000n;           // 10^7
  const LAKH     = 100000n;             // 10^5
  const THOUSAND = 1000n;               // 10^3

  let parts = [];

  // 1) shankh
  let shankhVal = num / SHANKH;
  if (shankhVal > 0n) {
    parts.push(numberToIndianWords(shankhVal));
    parts.push("shankh");
    num %= SHANKH;
  }
  // 2) padma
  let padmaVal = num / PADMA;
  if (padmaVal > 0n) {
    parts.push(numberToIndianWords(padmaVal));
    parts.push("padma");
    num %= PADMA;
  }
  // 3) neel
  let neelVal = num / NEEL;
  if (neelVal > 0n) {
    parts.push(numberToIndianWords(neelVal));
    parts.push("neel");
    num %= NEEL;
  }
  // 4) kharab
  let kharabVal = num / KHARAB;
  if (kharabVal > 0n) {
    parts.push(numberToIndianWords(kharabVal));
    parts.push("kharab");
    num %= KHARAB;
  }
  // 5) arab
  let arabVal = num / ARAB;
  if (arabVal > 0n) {
    parts.push(numberToIndianWords(arabVal));
    parts.push("arab");
    num %= ARAB;
  }
  // 6) crore
  let croreVal = num / CRORE;
  if (croreVal > 0n) {
    parts.push(numberToIndianWords(croreVal));
    parts.push("crore");
    num %= CRORE;
  }
  // 7) lakh
  let lakhVal = num / LAKH;
  if (lakhVal > 0n) {
    parts.push(numberToIndianWords(lakhVal));
    parts.push("lakh");
    num %= LAKH;
  }
  // 8) thousand
  let thousandVal = num / THOUSAND;
  if (thousandVal > 0n) {
    parts.push(numberToIndianWords(thousandVal));
    parts.push("thousand");
    num %= THOUSAND;
  }

  // 9) leftover up to 999
  if (num > 0n) {
    let lastChunk = threeDigitWords(Number(num));
    if (lastChunk) {
      parts.push(lastChunk);
    }
  }

  return parts.join(" ");
}

// ---- DYNAMIC BEHAVIOR ON INPUT ----
// Whenever we type in #numberInput, we update #resultBox with the words.

const numberInput = document.getElementById("numberInput");
const resultBox   = document.getElementById("resultBox");

// "input" event fires as the user types, deletes, or pastes text.
numberInput.addEventListener("input", () => {
  const val = numberInput.value.trim();
  if (!val) {
    // If empty, clear the box
    resultBox.textContent = "";
    return;
  }

  try {
    // Attempt to parse as BigInt
    let bigVal = BigInt(val);
    if (bigVal < 0) {
      resultBox.textContent = "Negative numbers are not supported.";
      return;
    }
    // Convert to Indian words
    let words = numberToIndianWords(bigVal) + " rupees";
    resultBox.textContent = words;

  } catch (err) {
    // If invalid, show an error
    resultBox.textContent = "Invalid input. Please enter a valid non-negative integer.";
  }
});
