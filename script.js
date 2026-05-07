const toggleTheme = document.querySelector('.toggleTheme');
const body = document.body;
const historicBtn = document.querySelector('.historicBtn');
const historicContainer = document.querySelector('.historic');
const closeHistoric = document.querySelector('.closeHistoric');
const cards = document.querySelectorAll('.color_card .card');
const generate = document.querySelector('.generate');
const colorGenerate = document.querySelector('.colorGenerate');
const info = document.querySelector('.info');
const infos = document.querySelector('.infos');
const lists = document.querySelector('.lists');

let historicStorage = JSON.parse(localStorage.getItem('historic-storage')) || [];

const save_historic = () => {
    localStorage.setItem('historic-storage', JSON.stringify(historicStorage));
}

colorGenerate.classList.add('active');

const createHistoric = () => {
    colorGenerate.classList.remove('active');
    historicContainer.classList.add('active');
}

const closeHistoricContainer = () => {
    historicContainer.classList.remove('active');
    colorGenerate.classList.add('active');
}


historicBtn.addEventListener('click', createHistoric);
closeHistoric.addEventListener('click', closeHistoricContainer);

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

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(input.value).then(() => {
                info.innerHTML = `
                    <p>Couleur: <b>${input.value}</b> copié avec succes</p>
                    <button class="closeInfo">
                        <iconify-icon icon="material-symbols:close"></iconify-icon>
                    </button
                `;
                info.classList.add('success');
                info.classList.remove('danger');
                info.classList.add('show');
                info.classList.remove('hide');
                const closeInfo = info.querySelector('.closeInfo');
                closeInfo.addEventListener('click', () => {
                    info.classList.add('hide');
                    info.classList.remove('show');
                });

                setTimeout(() => {
                    info.classList.add('hide');
                    info.classList.remove('show');
                }, 5000);

                const originalContent = btn.innerHTML;
                btn.innerHTML = `<iconify-icon icon="bi:check2-square"></iconify-icon>`;
                setTimeout(() => btn.innerHTML = originalContent, 1000);
            });
        });
    });
};

cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
        const newCard = card.querySelector('.copy-color').value;
        if (historicStorage.some(historic => historic.color === newCard)) {
            info.innerHTML = `
                <p>La couleur <b>${newCard}</b> est deja dans l'historique</p>
                <button class="closeInfo">
                    <iconify-icon icon="material-symbols:close"></iconify-icon>
                </button
            `;
            info.classList.add('danger');
            info.classList.remove('success');
            info.classList.add('show');
            info.classList.remove('hide');
            const closeInfo = info.querySelector('.closeInfo');
            closeInfo.addEventListener('click', () => {
                info.classList.add('hide');
                info.classList.remove('show');
            });

            setTimeout(() => {
                info.classList.add('hide');
                info.classList.remove('show');
            }, 5000);

        } else {
            historicStorage.push({
                id: Date.now(),
                color: newCard
            });
            uploadColorSave();
            save_historic();
        }
        console.log(newCard);


    });
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (info.classList.contains('show')) {
            info.classList.add('hide');
            info.classList.remove('show');
        }

        if (infos.classList.contains('show')) {
            infos.classList.add('hide');
            infos.classList.remove('show');
        }
    }
});

const uploadColorSave = () => {
    lists.innerHTML = '';

    if (historicStorage.length === 0) {
        const p = document.createElement('p');
        p.textContent = "Aucune palette de couleur n'a encore été sauvegardée";
        lists.appendChild(p);
        return;
    }

    historicStorage.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('card-historic');

        li.innerHTML = `
            <div class="box-color-historic" style="background-color: ${item.color}"></div>
            <div class="copy-historic">
                <input type="text" class="copy-color-historic" value="${item.color}" readonly>
                <button class="copy-btn">
                    <iconify-icon icon="material-symbols:content-copy"></iconify-icon>
                </button>
            </div>
        `;

        li.querySelector('.copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(item.color);

            console.log(`Copied: ${item.color}`);
        });

        li.addEventListener('click', () => {
            const newCard = li.querySelector('.copy-color-historic').value;
            infos.innerHTML = `
                <p>Voulez-vous supprimer le code couleur: <b>${newCard}</b> de votre historique ?</p>

        <div class="alert">
            <button class="confirm">Confirmer</button>
            <button class="cancel">Annuler</button>
        </div>
            `;
            infos.classList.add('danger');
            infos.classList.remove('success');
            infos.classList.add('show');
            infos.classList.remove('hide');
            const cancel = infos.querySelector('.cancel');
            cancel.addEventListener('click', () => {
                infos.classList.add('hide');
                infos.classList.remove('show');
            });
            const confirmBtn = infos.querySelector('.confirm');

            // Use a fresh listener that cleans itself up
            confirmBtn.addEventListener('click', () => {
                // 1. Filter the array
                // Note: Ensuring we compare strings to strings
                const targetColor = typeof newCard === 'object' ? newCard.color : newCard;
                historicStorage = historicStorage.filter(item => item.color !== targetColor);

                // 2. Update System
                uploadColorSave(); // Refresh UI
                save_historic();   // Sync LocalStorage

                // 3. UI Feedback
                infos.classList.replace('show', 'hide');
            }, { once: true }); // Crucial: prevents multiple listeners stacking up

            setTimeout(() => {
                infos.classList.add('hide');
                infos.classList.remove('show');
            }, 5000);
            console.log(li.querySelector('.copy-color-historic').value);

            // historicStorage.push({
            //     id: Date.now(),
            //     color: newCard
            // });



            // uploadColorSave();
            // save_historic();
        });

        lists.appendChild(li);
    });
}

uploadColorSave();


generate.addEventListener('click', randomColor);
randomColor();
copyColor();