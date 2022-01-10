let register = 0;
let action = '';
let inputToReset = false;

function pressNumber(number) {
    resetInput();
    input.value = +(input.value + number);
}

function pressDot() {
    resetInput();
    let index = input.value.indexOf('.');
    if (index < 0)
        input.value = input.value + '.';
}

function pressPlus() {
    finishInput();
    action = "+";
}

function pressMinus() {
    finishInput();
    action = "-";
}

function pressMul() {
    finishInput();
    action = "*";
}

function pressDiv() {
    finishInput();
    action = "/";
}

function pressEq() {
    finishInput();
    action = "=";
}

function finishInput() {
    switch (action) {
        case "+":
            register += +input.value;
            break;
        case "-":
            register -= +input.value;
            break;
        case "*":
            register *= +input.value;
            break;
        case "/":
            register /= +input.value;
            break;
        default:
            register = +input.value;
    }
    action = '';
    input.value = register;
    inputToReset = true;
}

function resetInput() {
    if (inputToReset) {
        input.value = 0;
        inputToReset = false;
    }
}