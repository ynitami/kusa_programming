const board = document.getElementById("board"); // boardを呼び出し
console.log(board);

let width = 20;
let height = 20;
let bombAmount = 50;

let initialized = false;

let timer;

function createBoard() {
  for (let i = 0; i < height; i++) {
    const column = document.createElement("div"); // divを作る関数
    column.classList.add("column"); // boardの一階層下のdivには全てクラスが。

    board.appendChild(column); // boardの中にdivのドムを作る
    for (let j = 0; j < width; j++) {
      const square = document.createElement("div");
      square.classList.add("square", "hidden");
      square.id = `${i}-${j}`; // idの追加
      column.appendChild(square); // columnの中にdivを作る
      square.addEventListener("click", function () {
        //console.log(i, j);
        handleClick(i, j);
      });
    }
  }
}

function setBomb() {
  const bombArray = getBombArray()
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const square = document.getElementById(`${i}-${j}`);
      if (square.classList.contains("blocked")) {
        square.classList.remove("blocked")
      } else {
        if (bombArray.pop() == "bomb") {
          // .popメソッド：配列の最後の要素を抜き取る, 配列からはその要素が無くなる

          square.classList.add("bomb");
          const text = document.createTextNode("X");
          square.appendChild(text); // textのドムを作る
        }
      }
    }
  }
}

function setBombAmount() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const square = document.getElementById(`${i}-${j}`);
      const bombAmountAround = getBombAmountAround(i, j);
      if (!square.classList.contains("bomb") && bombAmountAround > 0) {
        square.classList.add("danger")
        const text = document.createTextNode(bombAmountAround);
        square.appendChild(text);
      }
    }
  }
}

function blockAround(i, j) {
  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const square = document.getElementById(`${neighborI}-${neighborJ}`);
      if (square) {
        square.classList.add("blocked");
      }
    }
  }
}

function getBombArray() {
  const blockAmount = document.getElementsByClassName("blocked").length;
  //空の配列にfillメソッドで中身を
  const onlyBombArray = new Array(bombAmount).fill("bomb");
  const onlyEmptyArray = new Array(width * height - bombAmount - blockAmount).fill("empty");
  //concatメソッドで配列を順番通りに連結
  const concatterdArray = onlyBombArray.concat(onlyEmptyArray);
  //ライブラリ（Lodash）を活用して、シャッフル: Lodash → CDN files → Copy HTML → linkの下にペースト
  const bombArray = _.shuffle(concatterdArray);
  return bombArray;
}

function getBombAmountAround(i, j) {
  let bombAmountAround = 0;
  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const isSelf = (i == neighborI && j == neighborJ); // T or F
      const neighborSquare = document.getElementById(`${neighborI}-${neighborJ}`);
      if (!isSelf && neighborSquare && neighborSquare.classList.contains("bomb")) {
        bombAmountAround += 1;
      }
    }
  }
  return bombAmountAround;
}

function handleClick(i, j) {
  if (initialized) {
    click(i, j);
  } else {
    firstClick(i, j);
  }
}

function click(i, j) {
  const square = document.getElementById(`${i}-${j}`);
  if (square.classList.contains("bomb")) {
    window.alert("BOMB!");
    openAll();
    clearInterval(timer);
    return; // returnによって、以降の処理をせずに関数を終える
  }
  sweep(i, j);

  if (
    document.getElementsByClassName("bomb").length ==
    document.getElementsByClassName("hidden").length
  ) {
    window.alert("CLEAR");
    openAll();
    clearInterval(timer);
    return;
  }
}

function firstClick(i, j) {
  blockAround(i, j); // 初回クリックにblockedクラス追加
  setBomb();
  setBombAmount();
  sweep(i, j);
  startTimer();
  initialized = true;
}

function sweep(i, j) {
  const square = document.getElementById(`${i}-${j}`);
  if (!square || square.classList.contains("open")) {
    return;
  }
  square.classList.remove("hidden");
  square.classList.add("open");
  if (square.classList.contains("danger")) {
    return;
  }

  //再帰処理
  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const isSelf = i == neighborI && j == neighborJ;
      const neighborSquare = document.getElementById(`${neighborI}-${neighborJ}`);
      if (!isSelf && neighborSquare) {
        setTimeout(function () {
          sweep(neighborI, neighborJ);
        }, 100);
      }
    }
  }
}

// a = [1,2,3]
// for (i of a) → 配列aを順番に
function openAll() {
  const squares = document.getElementsByClassName("square");
  for (const square of squares) {
    square.classList.remove("hidden", "flag");
    square.classList.add("open");
  }
}

// $ : jQueryの関数
function createContextMenu() {
  $.contextMenu({ // 引数がオブジェクト
    selector: '.square', // ここをクリックすると
    callback: function (key, options) {　// クリック後に表示
      const square = options.$trigger[0]; // 要素数1の配列になるので、要素を取り出す
      if (key == "addFlag") {
        square.classList.add("flag");
      } else if (key == "removeFlag") {
        square.classList.remove("flag");
      }
    },
    items: { // 表示内容
      addFlag: { name: "フラグを立てる" },
      removeFlag: { name: "フラグを回収する" },
    }, // ここまで引数
  });
}

function startTimer() {
  const startTimestamp = new Date().getTime();
  // 1000msごとに第一引数の関数が実行
  timer = setInterval(function () {
    const currentTimestamp = new Date().getTime()
    const time = Math.floor((currentTimestamp - startTimestamp) / 1000);
    document.getElementById("timer").innerText = `${time} s`;
  }, 1000);
}

// function main() {
//   createBoard();
//   createContextMenu();
// }

// main();

document.getElementById("select-level-buttons").addEventListener("click", function (event) {
  const level = event.target.id
  switch (level) {
    case "beginner": {
      width = 9;
      height = 9;
      bombAmount = 10;
      break;
    }
    case "intermediate": {
      width = 16;
      height = 16;
      bombAmount = 40;
      break;
    }
    case "advanced": {
      width = 30;
      height = 16;
      bombAmount = 99;
      break;
    }
  }
  createBoard();
  createContextMenu();
},
  { once: true } // 1回だけ
);
