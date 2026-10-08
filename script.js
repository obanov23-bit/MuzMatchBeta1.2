const mockMusicians = [
    { name: "Никита", age: 18, instrument: "Бас-гитара", level: "Новичок (хочу учиться)", about: "Купил бас пару недель назад, хочу рубить панк-рок или альтернативу. Ищу ребят из Вологды, которые подтянут по инструменту.", vk: "https://vk.com", tg: "@nikita_bass" },
    { name: "Макс", age: 19, instrument: "Барабаны / Перкуссия", level: "Средний (ищу группу)", about: "Ориентируюсь на Кино, Пошлую Молли, старый рок. Есть свой кардан, опыт игры год. Готов собираться по выходным на репетиции.", vk: "", tg: "@max_drums" },
    { name: "Алёна", age: 17, instrument: "Вокал (Чистый)", level: "Профи", about: "Учусь на музыкальном, пою в разных стилях, хочу собрать банду играть инди-рок. Есть свои тексты и наработки демок.", vk: "https://vk.com", tg: "" },
    { name: "Сергей", age: 20, instrument: "Соло-гитара", level: "Средний (ищу группу)", about: "Играю соло и ритм. Ищу единомышленников для создания кавер-группы. Жанры: гранж, рок, метал.", vk: "https://vk.com", tg: "@serg_guitar" }
];

let currentIndex = 0;
let currentUser = null;

function startDating() {
    const name = document.getElementById('reg-name').value;
    const age = document.getElementById('reg-age').value;
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

    currentUser = { name, age, instrument, level, vk, tg, about };

    // ТОЧКА ИНТЕГРАЦИИ №1: ОТПРАВКА ДАННЫХ ТЕКУЩЕГО ПРОФИЛЯ В SUPABASE (insert)

    document.getElementById('screen-register').classList.add('hidden');
    document.getElementById('screen-dating').classList.remove('hidden');
    
    // ТОЧКА ИНТЕГРАЦИИ №2: ЗАГРУЗКА РЕАЛЬНЫХ АНКЕТ ИЗ БАЗЫ (select) ВМЕСТО МАССИВА mockMusicians
    
    showCard();
}

function showCard() {
    if (currentIndex >= mockMusicians.length) {
        alert("Анкеты в вашем городе временно закончились. Попробуем сначала!");
        currentIndex = 0;
    }
    
    const user = mockMusicians[currentIndex];
    document.getElementById('view-name').innerText = user.name;
    document.getElementById('view-meta').innerText = `${user.age} лет • ${user.instrument}`;
    document.getElementById('view-level').innerText = user.level;
    document.getElementById('view-about').innerText = user.about;
}

function nextCard() {
    // ТОЧКА ИНТЕГРАЦИИ №3: ЗАПИСЬ ДИЗЛАЙКА В ТАБЛИЦУ LIKES (status: false)
    currentIndex++;
    showCard();
}

function likeCard() {
    const currentMusician = mockMusicians[currentIndex];

    // ТОЧКА ИНТЕГРАЦИИ №4: ЗАПИСЬ ЛАЙКА В ТАБЛИЦУ LIKES (status: true) И ПРОВЕРКА ОТВЕТНОГО МЭТЧА

    document.getElementById('screen-dating').classList.add('hidden');
    document.getElementById('screen-match').classList.remove('hidden');

    if (currentMusician.vk) {
        document.getElementById('match-vk-box').classList.remove('hidden');
        document.getElementById('match-vk').href = currentMusician.vk;
    } else {
        document.getElementById('match-vk-box').classList.add('hidden');
    }

    if (currentMusician.tg) {
        document.getElementById('match-tg-box').classList.remove('hidden');
        document.getElementById('match-tg').href = currentMusician.tg.startsWith('@') ? `https://t.me{currentMusician.tg.substring(1)}` : `https://t.me{currentMusician.tg}`;
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
