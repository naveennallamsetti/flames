


const name1Input = document.getElementById('name1');
const name2Input = document.getElementById('name2');
const calculateButton = document.getElementById('calculate');
const resultDiv = document.getElementById('result');

calculateButton.addEventListener('click', (e) => {
    e.preventDefault();
    const name1 = name1Input.value.toLowerCase();
    const name2 = name2Input.value.toLowerCase();

    if (name1 && name2) {
        const flamesResult = calculateFLAMES(name1, name2);
        resultDiv.innerText = `FLAMES result: ${flamesResult}`;
    } else {
        alert('Please enter both names');
    }
});

function calculateFLAMES(name1, name2) {
    const flames = ['F', 'L', 'A', 'M', 'E', 'S'];
    const name1Letters = name1.split('');
    const name2Letters = name2.split('');

    for (let i = 0; i < name1Letters.length; i++) {
        for (let j = 0; j < name2Letters.length; j++) {
            if (name1Letters[i] === name2Letters[j]) {
                name1Letters.splice(i, 1);
                name2Letters.splice(j, 1);
                i--;
                break;
            }
        }
    }

    const remainingLettersCount = name1Letters.length + name2Letters.length;
    const flamesIndex = (remainingLettersCount - 1) % flames.length;
    return flames[flamesIndex];
}
