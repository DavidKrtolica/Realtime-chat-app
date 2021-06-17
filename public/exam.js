(async function getMessage() {
    const response = await fetch('/exam');
    const result = await response.json();
    console.log(result);
})();