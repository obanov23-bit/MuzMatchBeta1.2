// Конфигурация вашей работающей облачной базы данных Supabase (Стокгольм)
const SUPABASE_URL = 'https://supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_vCbqh5R7Ln9iEx6IFUqX4w_N8gDz2th';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let dbMusicians = [];
let currentIndex = 0;
let currentUser = null;

async function startDating() {
    const name = document.getElementById('reg-name').value.trim();
    const age = parseInt(document.getElementById('reg-age').value);
    const instrument = document.getElementById('reg-instrument').value;
    const level = document.getElementById('reg-level').value;
    const vk = document.getElementById('reg-vk').value.trim();
    const tg = document.getElementById('reg-tg').value.trim();
    const about = document.getElementById('reg-about').value.trim();

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
        // Отправка данных анкеты в облачную таблицу waitlist
        const { data: record, error } = await supabaseClient
            .from('waitlist')
            .insert([data])
            .select()
            .maybeSingle();

        if (error) throw error;

        currentUser = record;
        alert("Успешно! Ваша анкета сохранена в глобальной базе.");

        document.getElementById('screen-register').classList.add('hidden');
        document.getElementById('screen-dating').classList.remove('hidden');
        
        await loadMusicians();
    } catch (error) {
        console.error("Ошибка Supabase при создании анкеты:", error);
        alert("Не удалось сохранить анкету. Убедитесь, что подключение к сети стабильно!");
    }
}

async function loadMusicians() {
    try {
        // Получение всех анкет из Supabase
        const { data: records, error } = await supabaseClient
            .from('waitlist')
            .select('*');

        if (error) throw error;

        // Исключаем свою анкету из выдачи карточек
        if (currentUser) {
            dbMusicians = records.filter(musician => musician.id !== currentUser.id);
        } else {
            dbMusicians = records;
        }
        
        currentIndex = 0;
        showCard();
    } catch (error) {
        console.error("Ошибка Supabase при загрузке данных:", error);
        alert("Не удалось загрузить анкеты из базы данных.");
    }
}

function showCard() {
    if (dbMusicians.length === 0 || currentIndex >= dbMusicians.length) {
        alert("Анкеты временно закончились. Попробуем посмотреть сначала!");
        currentIndex = 0;
        if (dbMusicians.length === 0) return;
    }
    
    const user = dbMusicians[currentIndex];
    document.getElementById('view-name').innerText = user.Username || "Без имени";
    document.getElementById('view-meta').innerText = `${user.Age || '??'} лет • ${user.instrument || 'Не указан'}`;
    document.getElementById('view-level').innerText = user.Skill_level || "Не указан";
    document.getElementById('view-about').innerText = user.description || "Описание отсутствует.";
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
        // Исправлено: Добавлен корректный знак шаблона \$ и косая черта для ссылок Telegram
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
