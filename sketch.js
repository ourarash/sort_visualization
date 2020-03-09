// By Arash Saifhashemi
// Visualizing sort algorithms in P5.js
/// <reference path="../node_modules/@types/p5/global.d.ts" />
let globals = {
  values: [],
  n: 200,
  w: 1,
  cnv: {},
  osc: {},
  playing: false,

  bubbleSort: {
    lastRightIndex: 0,
    i: 0,
    iInit: 0,
    topInit: -1,
    n: 30,
    status: false
  },
  selectionSort: {
    lastRightIndex: 0,
    i: 0,
    iInit: 0,
    topInit: -1,

    n: 100,
    status: false
  },
  mergeSort: {
    done: false,
    curr_size: 1,
    left_start: 0,
    n: 100,
    status: false,
    iInit: 0,
    topInit: -1
  },
  quickSort: {
    n: 200,
    stack: function() {
      return Array(this.n);
    },
    top: -1,
    iInit: 0,
    topInit: -1,
    status: false
  },
  heapSort: {
    n: 100,
    i: 100 - 1,
    iInit: 100 - 1,
    topInit: -1,

    status: false
  }
};

let sort = "selectionSort";
let time = 0;
let delayTime = 0;

// Initialize variables used by each sort
// and also create a random array
function init(sort) {
  globals.n = globals[sort].n;
  globals[sort].i = globals[sort].iInit;
  globals[sort].top = globals[sort].topInit;
  globals[sort].left_start = 0;
  globals[sort].curr_size = 1;
  globals[sort].status = false;

  globals.values = new Array(Math.floor(globals.n));
  globals.bubbleSort.lastRightIndex = globals.values.length - 1;
  for (let i = 0; i < globals.values.length; i++) {
    globals.values[i] = random(height);
  }
}

// Selects the sort algorithm using radio buttons
function displayRadioValue() {
  var ele = document.getElementsByName("gender");

  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      document.getElementById("result").innerHTML = "Gender: " + ele[i].value;
      sort = ele[i].value;
      playOscillator();
      init(sort);
      time = 0;
      delayTime = 0;
    }
  }
}

function setup() {
  globals.cnv = createCanvas(windowWidth, 600);
  globals.cnv.mousePressed(playOscillator);
  globals.osc = new p5.Oscillator("sine");
  globals.osc.start();
  if (globals.playing) {
    globals.osc.amp(100);
  } else {
    globals.osc.amp(0);
  }

  init(sort);
}

// Starts playing a note
function playOscillator() {
  globals.osc.amp(100);
  // globals.cnv.freq(10 + time, 1);
  globals.playing = true;
}

function stopOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  globals.osc.amp(0, 0.5);
}

// Main draw function
async function draw() {
  background(0);
  stroke(255, 0, 0);
  strokeWeight(globals.w);

  // Before running the sort algorithm, first play the whole array
  if (delayTime > globals.values.length) {
    let label;
    switch (sort) {
      case "bubbleSort":
        label = "Bubble Sort";
        bubbleSort();
        break;
      case "selectionSort":
        label = "Selection Sort";
        selectionSort(globals.values);
        break;
      case "mergeSort":
        label = "Merge Sort";
        mergeSort(globals.values);
        break;
      case "heapSort":
        label = "Heap Sort";
        heapSort(globals.values);
        break;
      case "quickSort":
        label = "Quick Sort";
        quickSortIterative(globals.values, 0, globals.values.length - 1);
        break;
    }

    push();
    textSize(32);
    fill(255, 255, 255);
    text(label, width / 4, height / 10);
    pop();
    time++;
  } else {
    for (let i = 0; i < globals.values.length; i++) {
      stroke(0, 0, 0);

      fill(255, 255, 0);
      if (i == delayTime) {
        fill(255, 0, 0);
      }
      DrawRect(
        (i * width) / globals.n,
        height,
        width / globals.n,
        -globals.values[i],
        true
      );
    }
  }

  delayTime++;
}

// Draws a rectangle and also plays a note with
// frequency relative to the height (h)
function DrawRect(x, y, w, h, play = true) {
  if (globals.playing && play) {
    f = map(-h, 0, height, 200, 5000);
    freq = constrain(f, 200, 5000);

    globals.osc.freq(f);
    globals.osc.amp(1, 0.1);
  }

  rect(x, y, w, h);
  fill(0);
  rect(x, y + h, w, globals.w * 10);
}

// Find the index of maximum value in an array
function FindMinIndex(input, start_index) {
  let min_index = start_index;
  let cur_min = input[start_index];
  for (let i = start_index; i < input.length; i++) {
    if (input[i] < cur_min) {
      cur_min = input[i];
      min_index = i;
    }
  }
  return min_index;
}

// Selection sort algorithm.
function selectionSort(input) {
  for (let i = 0; i < globals.values.length; i++) {
    if (i < globals.selectionSort.i) {
      stroke(0, 0, 0);
      fill(0, 255, 0);
      DrawRect(
        (i * width) / globals.n,
        height,
        width / globals.n,
        -globals.values[i],
        !globals.selectionSort.status
      );
    } else {
      fill(255, 255, 0);
      DrawRect(
        (i * width) / globals.n,
        height,
        width / globals.n,
        -globals.values[i],
        !globals.selectionSort.status
      );
    }
  }

  let min_index = FindMinIndex(input, globals.selectionSort.i);

  if (min_index >= input.length) {
    globals.selectionSort.status = true;

    globals.osc.amp(0, 0.1);
  } else {
    fill(255, 0, 0);
    DrawRect(
      (min_index * width) / globals.n,
      height,
      width / globals.n,
      -globals.values[min_index],
      true
    );

    [input[globals.selectionSort.i], input[min_index]] = [
      input[min_index],
      input[globals.selectionSort.i]
    ];
  }
  globals.selectionSort.i++;
}

// Bubble sort algorithm
function bubbleSort() {
  for (let i = 0; i < globals.values.length; i++) {
    if (i > globals.bubbleSort.lastRightIndex) {
      stroke(0, 0, 0);
      fill(0, 255, 0);
      DrawRect(
        (i * width) / globals.n,
        height,
        width / globals.n,
        -globals.values[i],
        !globals.bubbleSort.status
      );
    } else {
      fill(255, 255, 0);
      DrawRect(
        (i * width) / globals.n,
        height,
        width / globals.n,
        -globals.values[i],
        !globals.bubbleSort.status
      );
    }
  }
  let foundSwap = false;
  if (
    globals.values[globals.bubbleSort.i] >
    globals.values[globals.bubbleSort.i + 1]
  ) {
    foundSwap = true;
    [
      globals.values[globals.bubbleSort.i],
      globals.values[globals.bubbleSort.i + 1]
    ] = [
      globals.values[globals.bubbleSort.i + 1],
      globals.values[globals.bubbleSort.i]
    ];
    stroke(0, 0, 0);
    fill(0, 0, 255);
    DrawRect(
      (globals.bubbleSort.i * width) / globals.n,
      height,
      width / globals.n,
      -globals.values[globals.bubbleSort.i]
    );
  }

  if (globals.bubbleSort.lastRightIndex<1) {
    globals.bubbleSort.status = true;
    globals.osc.amp(0, 1);
  }
  globals.bubbleSort.i++;
  if (globals.bubbleSort.i > globals.bubbleSort.lastRightIndex) {
    globals.bubbleSort.i = 0;
    globals.bubbleSort.lastRightIndex--;
  }
}
//-----------------------------------------------------------------------------
// Merge sort functions
// Find the minimum value in left and right arrays and increments their indices
// This function is used by merge
function GetMinValueAndIncrementItsIndex(
  input,
  left_index,
  right_index,
  left_max_index,
  right_max_index
) {
  let result = {
    left_index: left_index,
    right_index: right_index,
    min_value: 0
  };
  if (left_index > left_max_index) {
    result.min_value = input[result.right_index++];
    return result;
  }
  if (right_index > right_max_index) {
    result.min_value = input[result.left_index++];
    return result;
  }
  if (input[left_index] <= input[right_index]) {
    result.min_value = input[result.left_index++];
    return result;
  } else {
    result.min_value = input[result.right_index++];
    return result;
  }
}

// Merges two arrays from l to m, to r
function Merge(input, l, m, r) {
  // We only copy from l to r (including r)
  let input_copy = input.slice(l, r + 1);

  let left_index = 0;
  let right_index = m + 1 - l; // adjust m+1 by subtracting l from it
  let left_max_index = m - l; // Last index of left half
  let right_max_index = r - l; // Last index of right half
  for (let i = l; i <= r; i++) {
    let result = GetMinValueAndIncrementItsIndex(
      input_copy,
      left_index,
      right_index,
      left_max_index,
      right_max_index
    );
    input[i] = result.min_value;
    left_index = result.left_index;
    right_index = result.right_index;
  }
}

function mergeSort(input) {
  // curr_size varies from 1 to n/2

  let n = input.length;

  // Merge subarrays in bottom up manner.  First merge subarrays of
  // size 1 to create sorted subarrays of size 2, then merge subarrays
  // of size 2 to create sorted subarrays of size 4, and so on.

  // Pick starting point of different subarrays of current size

  let mid = min(
    globals.mergeSort.left_start + globals.mergeSort.curr_size - 1,
    n - 1
  );

  let right_end = min(
    globals.mergeSort.left_start + 2 * globals.mergeSort.curr_size - 1,
    n - 1
  );

  for (let i = 0; i < n; i++) {
    stroke(255, 0, 0);

    fill(255, 255, 255);

    if (i >= globals.mergeSort.left_start && i < mid) {
      fill(0, 255, 0);
    } else if (i >= mid && i < right_end) {
      fill(0, 88, 255);
    }

    DrawRect(
      (i * width) / globals.n,
      height,
      width / globals.n,
      -input[i],
      !globals.mergeSort.status
    );
  }

  Merge(input, globals.mergeSort.left_start, mid, right_end);
  globals.mergeSort.left_start += 2 * globals.mergeSort.curr_size;

  if (globals.mergeSort.left_start >= n - 1) {
    globals.mergeSort.left_start = 0;
    globals.mergeSort.curr_size *= 2;
  }

  if (globals.mergeSort.curr_size > input.length) {
    globals.mergeSort.status = true;
    globals.osc.amp(0, 1);  }
}
//-----------------------------------------------------------------------------
// quicksort functions

function partition(arr, l, h) {
  let x = arr[h];
  let i = l - 1;

  for (let j = l; j <= h - 1; j++) {
    if (arr[j] <= x) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      // swap(&arr[i], &arr[j]);
    }
  }
  [arr[i + 1], arr[h]] = [arr[h], arr[i + 1]];

  // swap(&arr[i + 1], &arr[h]);
  return i + 1;
}

// Iterative quick sort using stack
/* A[] --> Array to be sorted,  
l --> Starting index,  
h --> Ending index */
function quickSortIterative(arr, l, h) {
  // Create an auxiliary globals.quickSort.stack
  // let globals.quickSort.stack = Array([h - l + 1]);

  // initialize top of globals.quickSort.stack
  // let top = -1;

  for (let i = 0; i < arr.length; i++) {
    stroke(255, 0, 0);
    fill(0, 255, 0);
    DrawRect(
      (i * width) / globals.n,
      height,
      width / globals.n,
      -arr[i],
      !globals.quickSort.status
    );
  }
  // push initial values of l and h to globals.quickSort.stack
  if (time == 0) {
    globals.quickSort.stack[++globals.quickSort.top] = l;
    globals.quickSort.stack[++globals.quickSort.top] = h;
  }

  // Keep popping from globals.quickSort.stack while is not empty
  if (globals.quickSort.top >= 0) {
    // Pop h and l
    h = globals.quickSort.stack[globals.quickSort.top--];
    l = globals.quickSort.stack[globals.quickSort.top--];

    // Set pivot element at its correct position
    // in sorted array
    let p = partition(arr, l, h);

    // If there are elements on left side of pivot,
    // then push left side to globals.quickSort.stack
    if (p - 1 > l) {
      globals.quickSort.stack[++globals.quickSort.top] = l;
      globals.quickSort.stack[++globals.quickSort.top] = p - 1;

      for (let i = l; i < p; i++) {
        stroke(255, 0, 0);
        fill(255, 0, 0);
        DrawRect((i * width) / globals.n, height, width / globals.n, -arr[i]);
      }
    }

    // If there are elements on right side of pivot,
    // then push right side to globals.quickSort.stack
    if (p + 1 < h) {
      globals.quickSort.stack[++globals.quickSort.top] = p + 1;
      globals.quickSort.stack[++globals.quickSort.top] = h;

      for (let i = p; i < h; i++) {
        stroke(255, 0, 0);
        fill(0, 0, 255);
        DrawRect((i * width) / globals.n, height, width / globals.n, -arr[i]);
      }
    }
  } else {
    globals.quickSort.status = true;
    globals.osc.amp(0, 1);  }
}
//-----------------------------------------------------------------------------
// Heapsort functions
// To heapify a subtree rooted with node i which is
// an index in arr[]. n is size of heap
function heapify(arr, n, i) {
  // let n = arr.length;
  let largest = i; // Initialize largest as root
  let l = 2 * i + 1; // left = 2*i + 1
  let r = 2 * i + 2; // right = 2*i + 2

  // If left child is larger than root
  if (l < n && arr[l] > arr[largest]) {
    largest = l;
  }

  // If right child is larger than largest so far
  if (r < n && arr[r] > arr[largest]) {
    largest = r;
  }

  // If largest is not root
  if (largest != i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];

    heapify(arr, n, largest);
  }
}

// main function to do heap sort
function heapSort(arr) {
  let n = arr.length;

  // Build heap (rearrange array)
  if (time == 0) {
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i);
    }
  }

  // One by one extract an element from heap
  // for (let i = n - 1; i >= 0; i--) {
  // console.log("globals.heapSort.i: ", JSON.stringify(globals.heapSort.i));
  if (globals.heapSort.i >= 0) {
    // Move current root to end
    [arr[0], arr[globals.heapSort.i]] = [arr[globals.heapSort.i], arr[0]];

    // call max heapify on the reduced heap
    heapify(arr, globals.heapSort.i, 0);
    globals.heapSort.i--;
  } else {
    globals.heapSort.status = true;
    globals.osc.amp(0, 1);  }

  for (let i = 0; i < arr.length; i++) {
    stroke(255, 0, 0);
    fill(0, 255, 0);
    if (i < globals.heapSort.i) {
      fill(255, 255, 0);
    } else if (i == globals.heapSort.i || i == globals.heapSort.i + 1) {
      fill(255, 0, 0);
    } else if (i == 0) {
      fill(255, 0, 0);
    }
    DrawRect(
      (i * width) / globals.n,
      height,
      width / globals.n,
      -arr[i],
      !globals.heapSort.status
    );
  }
}
