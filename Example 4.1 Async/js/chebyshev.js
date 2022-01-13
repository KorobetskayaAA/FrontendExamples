function testChebyshevTheorem(n) {
    let tStart = performance.now();
    let sum = 0,
        sumOfSquares = 0;
    for (let i = 0; i < n; i++) {
        let rnd = 0;
        for (let r = 0; r < 12; r++) {
            rnd += Math.random() - 0.5;
        }
        sum += rnd;
        sumOfSquares += rnd * rnd;
    }
    const mean = sum / n,
        sd = Math.sqrt(sumOfSquares / n - mean * mean);
    let tEnd = performance.now();
    console.log(`Generation took ${((tEnd - tStart) / 1000).toFixed(3)}s`);
    return { count: n, mean, sd };
}

window.addEventListener("load", () => {
    document
        .querySelector("#calc-chebyshev")
        .addEventListener("click", async() => {
            const calcOption = document.querySelector(
                'input[type="radio"][name="async-option"][checked]'
            ).value;
            const resultElement = document.querySelector("#result-chebyshev");
            resultElement.innerHTML = "Начались вычисления";
            const result =
                calcOption === "none" ?
                callNoAsync() :
                calcOption === "async" ?
                callAsync() :
                await callAsync();
            console.log(result);
            resultElement.innerHTML = `Сгенерировано чисел: ${result.count}<br/> Среднее значение: ${result.mean}<br/> Стандартное отклонение: ${result.sd}`;
        });

    function callNoAsync() {
        return testChebyshevTheorem(5e7);
    }

    async function callAsync() {
        return callNoAsync();
    }
});