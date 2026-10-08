const pb = new PocketBase('http://127.0.0.1:8090');

let dbMusicians = [];
let currentIndex = 0;
let currentUser = null;

async function startDating() {
    const name = document.getElementById('reg-name').value;
    const age = parseInt(document.getElementById('reg-age').value);
    const instrument = document.getElementById('reg-instrument').value;
    const level = document.getElementById('reg-level').value;
    const vk = document.getElementById('reg-vk').value;
    const tg = document.getElementById('reg-tg').value;
    const about = document.getElementById('reg-about').value;

    if(!name || !age || !instrument || !level) {
        return alert("Пожалуйста, заполните основные поля анкеты (Имя, Возраст, Инструмент, Уровень)!");
    }

    if(!vk && !tg) {
        return alert("Пожалуйста, оставьте хотя бы один контакт (ВК или Telegram), чтобы с вами могли связаться!");
    }

    const data = {
        Username: name,
        Age: age,
        instrument: instrument,
        Skill_level: level,
        vk_link: vk,
        Nickname_TG: tg,
        description: about
    };

    try {
        currentUser = await pb.collection('waitlist').create(data);
        alert("Успешно! Ваша анкета создана.");

        document.getElementById('screen-register').classList.add('hidden');
        document.getElementById('screen-dating').classList.remove('hidden');
        
        await loadMusicians();
    } catch (error) {
        console.error(error);
        alert("Не удалось сохранить анкету. Проверь базу данных!");
    }
}

async function loadMusicians() {
    try {
        const records = await pb.collection('waitlist').getFullList({
            sort: '-created',
        });
        dbMusicians = records.filter(musician => musician.id !== currentUser.id);
        currentIndex = 0;
        showCard();
    } catch (error) {
        console.error(error);
        alert("Не удалось загрузить анкеты из базы данных.");
    }
}

function showCard() {
    if (dbMusicians.length === 0 || currentIndex >= dbMusicians.length) {
        alert("Анкеты в вашем городе временно закончились. Попробуем сначала!");
        currentIndex = 0;
        if (dbMusicians.length === 0) return;
    }
    
    const user = dbMusicians[currentIndex];
    document.getElementById('view-name').innerText = user.Username;
    document.getElementById('view-meta').innerText = `${user.Age} лет • ${user.instrument}`;
    document.getElementById('view-level').innerText = user.Skill_level;
    document.getElementById('view-about').innerText = user.description;
}

function nextCard() {
    currentIndex++;
    showCard();
}

function likeCard() {
    if (dbMusicians.length === 0 || !dbMusicians[currentIndex]) return;
    
    const currentMusician = dbMusicians[currentIndex];

    document.getElementById('screen-dating').classList.add('hidden');
    document.getElementById('screen-match').classList.remove('hidden');

    if (currentMusician.vk_link) {
        document.getElementById('match-vk-box').classList.remove('hidden');
        document.getElementById('match-vk').href = currentMusician.vk_link;
    } else {
        document.getElementById('match-vk-box').classList.add('hidden');
    }

    if (currentMusician.Nickname_TG) {
        document.getElementById('match-tg-box').classList.remove('hidden');
        let tgNick = currentMusician.Nickname_TG;
        if (tgNick.startsWith('@')) {
            tgNick = tgNick.substring(1);
        }
        document.getElementById('match-tg').href = `https://t.me{tgNick}`;
    } else {
        document.getElementById('match-tg-box').classList.add('hidden');
    }
}

function backToDating() {
    document.getElementById('screen-match').classList.add('hidden');
    document.getElementById('screen-dating').classList.remove('hidden');
    currentIndex++;
    showCard();
}
    


