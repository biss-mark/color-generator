const toggleTheme = document.querySelector('.toggleTheme');
const body = document.body;
const historicBtn = document.querySelector('.historicBtn');
const historicContainer = document.querySelector('.historic');
const closeHistoric = document.querySelector('.closeHistoric');
const cards = document.querySelectorAll('.color_card .card');
const generate = document.querySelector('.generate');

const updateThemeUI = (theme) => {
    const icon = theme === 'light' ? 'material-symbols:light-mode' : 'material-symbols:dark-mode';
    toggleTheme.innerHTML = `<iconify-icon icon="${icon}"></iconify-icon>`;
    
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
};


const savedTheme = localStorage.getItem('theme_color') || 'light';
updateThemeUI(savedTheme);

toggleTheme.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme_color') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    localStorage.setItem('theme_color', newTheme);
    updateThemeUI(newTheme);
});

const colors = [];
const colorHex = '1234567890ABCDEF';
const randomColor = () => {
    colors.length = 0;
    
    for (let i = 0; i < cards.length; i++) {
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += colorHex[Math.floor(Math.random() * colorHex.length)];
        }

        colors.push(color);
    }
    generateColor(colors);
}


const generateColor = (colors) => {
    cards.forEach((card, index) => {
        card.querySelector('.box-color').style.backgroundColor = colors[index];
        card.querySelector('.copy-color').value = colors[index];
    });
}


const copyColor = () => {
    cards.forEach(card => {
        const btn = card.querySelector('.copy-btn');
        const input = card.querySelector('.copy-color');

        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(input.value).then(() => {
                console.log('Copié :', input.value);
                
                const originalContent = btn.innerHTML;
                btn.innerHTML = `<iconify-icon icon="bi:check2-square"></iconify-icon>`; 
                setTimeout(() => btn.innerHTML = originalContent, 1000);
            });
        });
    });
};


generate.addEventListener('click', randomColor);
randomColor();

copyColor();