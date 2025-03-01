//Manual Process
export const temp_cube_m = 'Фактична температура куба. Чорний датчик';
export const temp_cargi_m = 'Фактична температура царги. Зелений датчик';
export const temp_defl_m = 'Фактична температура дефлегматора. Червоний датчик';
export const temp_water_m = 'Фактична температура води (аварійного датчика). Білий датчик.';
export const ten_m =
  'Вимикач нагрівача (ТЕНу) регулювання потужності нагрівача у %. Наприклад, якщо у Вас ТЕН 3500 Вт, то 50% приблизно відповідатиме потужності 1750 Вт.';
export const pid_m =
  'ПІД регулятор, ця функція дозволяє підтримувати точну температуру рідини в кубі, в межах 1 градуса. Наприклад, якщо включити ТЕН на 50%, а ПІД на 70С, то ємність нагріватиметься приблизною потужністю 1750 Вт, після досягнення температури 70С, включиться режим підтримки температури.';
export const water_m =
  'Включає подачу води. Клапан може бути відкритий або закритий, він не регулює швидкість подачі води! Налаштування напору води необхідно проводити за допомогою голкового крана подачі води, встановленого на колоні.';
export const selection_m =
  'Включає головний клапан відбору. Основний клапан відбору регулює швидкість відбору. Наприклад, якщо встановлено швидкість 10%, то клапан відкритий 1 секунду, а закритий 9 секунд. Якщо встановлено швидкість 30%, то клапан відкритий 3 секунди, а закритий 7 секунд тощо.';
export const heads_m =
  'Включає та вимикає клапан голів. Клапан може бути відкритий або закритий, він не регулює швидкість! Клапан використовується в парі з трійником і спрямовує потік. Голови на одну ємність, тіло на іншу.';
export const tails_m =
  'Включає клапан відбору хвостів. Увага, клапан відбору хвостів встановлюється лише на нижньому вузлі відбору, який служить для паралельного відбору хвостів. Клапан відбору хвостів регулює швидкість відбору. Наприклад, якщо встановлено швидкість 10%, то клапан відкритий 1 секунду, а закритий 9 секунд. Якщо встановлено швидкість 30%, то клапан відкритий 3 секунди, а закритий 7 секунд тощо.';
export const water_break_m =
  'У ручному режимі можна встановити температуру аварії для будь-якого пристрою за білим датчиком. Кнопка включає режим Аварія, налаштування температури задає температуру спрацювання. При досягненні температури спрацьовування буде відключено ТЕН, потім через хвилину подача води.';
export const level_break_m =
  'У ручному режимі можна встановити аварію по оптичному датчику. Датчик необхідно закріпити на прозорій ємності (скло або пластик). При досягненні рівня спрацювання буде відключено ТЕН, потім через хвилину подача води. Увага, оптичний датчик і не працює на ємностях із кольорового пластику або металу.';
export const cube_break_m =
  'Кнопка включає режим Аварія, налаштування температури задає температуру спрацьовування по чорному датчику (Куб). При досягненні температури спрацьовування буде відключено ТЕН, потім через хвилину подача води.';
export const temp_selection_m =
  'При досягненні заданої граничної температури, відбір буде припинено, відбір відновиться, якщо температура впаде нижче значення «Гістерезис відбору». Допустимо, температура відбору 75С, гістерезис 0,5С. При досягненні температури 75С Основний клапан відбору закриється, при падінні до 74,5С клапан знову відкриється із заданою швидкістю відбору (параметр Швидкість відбору).';


export const gist_selection_m = 'Температурний діапазон, де працює основний клапан відбору. При досягненні температури відбору клапан припинить відбір, при падінні температури на величину гістерезису відбір буде відновлений.';


export const speed_selection_m =
  'Швидкість добору основного клапана відбору. Наприклад, якщо встановлено швидкість 10%, то клапан відкритий 1 секунду, а закритий 9 секунд. Якщо встановлено швидкість 30%, то клапан відкритий 3 секунди, а закритий 7 секунд тощо.';
export const speed_selection_tails_m =
  'Швидкість відбору клапана відбору хвостів. Наприклад, якщо встановлено швидкість 10%, то клапан відкритий 1 секунду, а закритий 9 секунд. Якщо встановлено швидкість 30%, то клапан відкритий 3 секунди, а закритий 7 секунд тощо.';
//Distillation Process
export const power_acceleration_m =
  'Розгін куба до температури переходу, налаштованої за Чорним датчиком. Регулювання потужності нагрівача у %. Наприклад, якщо у Вас ТЕН 3500 Вт, то 50% приблизно відповідатиме потужності 1750 Вт.';
export const power_selection_m =
  'Потужність відбору голів у % від потужності Вашого ТЕНу, для режиму відбору ГОЛІВ. Допустимо, якщо у Вас ТЕН 3 кВт, то 50% означає 1,5 кВт.';
export const power_selection_body_m =
  "Потужність у % від потужності Вашого ТЕНу, для режима відбору ТІЛА. Допустимо, якщо у Вас ТЕН 3 кВт, то 50% означає 1,5 кВт. Для режиму потстил або прямої перегонки необхідно відключити потужність відбору тіла, таким чином перегонка буде проходити на потужності відбору. Для цього у вікні 'Перехід тіла' вибрати 'Час хвилин' та встановити значення 0 хвилин";
export const time_body_transition_m =
  'Після досягнення параметра «Температура переходу», починається відбір голів, після закінчення часу «Час мін перехід тіла» починається відбір тіла. Потужність змінюється до параметра «Потужність відбору тіла», клапан голів закривається, спрямовуючи тіло через трійник в окрему ємність. (якщо в налаштуваннях встановлено «Голови вниз»). Якщо підключений датчик рівня, то перехід відбудеться по датчику рівня, якщо ємність заповниться раніше зазначеного часу (якщо в налаштуваннях встановлено «Голови вниз»)';
export const temp_breakdown_m =
  'При досягненні цієї температури (білий датчик), Автоматика вимкне ТЕН і через одну хвилину вимкне подачу води. Цей датчик рекомендується встановити на виході води з холодильника.';
export const temp_transition_m =
  'При досягненні цієї температури в кубі (чорний датчик) автоматика подасть воду, зменшить потужність до параметра «Потужність відбору». Почнеться відбір голів. Клапан відбору голів відкритий (якщо Голови настроєні вниз)';
export const temp_stop_m =
  'При досягненні цієї температури в кубі (чорний датчик), Автоматика вимкне ТЕН і через одну хвилину вимкне подачу води.';
export const temp_transition_body_m =
  "Після досягнення параметра 'Температура куба' починається відбір тіла. Потужність змінюється до параметра 'Потужність відбору тіла', клапан голів закривається, спрямовуючи тіло через трійник в окрему ємність. (якщо в установках встановлено 'Голови вниз')";
//Rectification
export const temp_selection_heads_m =
  'Цей параметр підбирається автоматично після закінчення стабілізації колони і може бути змінений згодом тільки на сенсорному екрані блоку. Це може знадобитися, якщо в процесі відбору голів неправильно вибрано гістерезис або недостатньо стабілізувалася колона. У такому разі відбір голів буде припинено, і колона працюватиме сама на себе. Для відновлення роботи режиму відбору голів необхідно на сенсорному екрані збільшити температуру відбору голів вище поточної. Червоний датчик.';
export const temp_selection_tails_m =
  'Значення температури в кубі (чорний датчик), при досягненні якого автоматика почне відбирати хвости (для версій автоматики вище 4,0) зі швидкістю, вказаною у вікні «Швидкість відбору хвостів». Увага. Відбір хвостів здійснюється ТІЛЬКИ через нижній вузол відбору хвостів, який не входить до комплекту постачання Автоматики!';
export const temp_selection_body_m =
  'Значення температури в градусах, яке буде додано до температури відбору голів після переходу на відбір тіла. Допустимо, колона стабілізувалася на температурі 77С, при значенні температури відбору тіла 0,1С, режим відбору тіла працюватиме на температурі 77,1С.';
export const gist_selection_body_m =
  'Температурний діапазон, у межах якого буде відбір тіла. При виході за межі даного гістерезису колона перейде в режим роботи по циклах (Старт Стоп). Відбір буде зупинено до стабілізації колони (падіння температури до температури відбору тіла + температура відбору голів) і після кожного виходу за межі гістерезису буде зменшуватися швидкість відбору на значення, задане у вікні «Зменшення за циклами». Поки швидкість відбору не досягне нуля або не пройде кількість циклів, встановлена у вікні «Кількість циклів». Після цього Автоматика вимкне ТЕН і за одну хвилину вимкне подачу води.';
export const gist_selection_heads_m =
  'Розмір температурного діапазону, в межах якого автоматика буде відбирати голови після стабілізації колони. При виході за межі цього температурного діапазону система припинить відбір, до повернення колони до температури стабілізації. Якщо через деякий час колона не повернулася до початкової температури, це означає, що обладнання не було правильно стабілізовано і відновити процес можна, збільшивши температуру відбору голів (Тільки на сенсорному екрані)! Червоний датчик.';
export const transition_select_body_m =
  "Розмістити датчик рівня на прозору ємність лампочкою назовні. При досягненні рівня голів у ємності до центру датчика відбудеться перехід відбір тіла. Потужність зміниться на потужність відбору тіла. Якщо в меню налаштувань встановлено відбір голів 'Рівень'";
export const speed_selection_body_m =
  'Задана швидкість відбору тіла. Основний клапан відбору регулює швидкість відбору. Наприклад, якщо встановлено швидкість 10%, то клапан відкритий 1 секунду, а закритий 9 секунд. Якщо встановлено швидкість 30%, то клапан відкритий 3 секунди, а закритий 7 секунд тощо.';
export const speed_selection_heads_m =
  'Задана швидкість відбору голів. Основний клапан відбору регулює швидкість відбору. Наприклад, якщо встановлено швидкість 10%, то клапан відкритий 1 секунду, а закритий 9 секунд. Якщо встановлено швидкість 30%, то клапан відкритий 3 секунди, а закритий 7 секунд тощо.';
export const decrease_selection_m =
  'Температура в кубі (чорний датчик), при якій Автоматика зменшить швидкість відбору на значення, вказане у вікні «Зменшення швидкості відбору»';
export const decrease_speed_selection_m =
  'Значення, на яке автоматика зменшить швидкість відбору, досягаючи температури, заданої у вікні Зменшення відбору куб.';
export const stabilisation_column_m =
  'Час роботи колони він (без відбору) після закінчення розгону, на початок процесу відбору голів. Це дуже важливий процес і не рекомендується встановлювати занадто короткий час стабілізації колони!';
export const power_selection_tails_m = 'Потужність відбору хвостів при досягненні температури хвостів';
export const temp_selection_cargi_m = 'Температура царги, при якій починається зменшення відбору';
export const decrease_speed_cargi_m =
  'Зменшення швидкості відбору, яке відбуватиметься після того, як розпочнеться відбір тіла. Це зменшення рекомендується використовувати для тарілчастих колон у режимі дистиляції. Після початку відбору тіла Автоматика фіксує температуру по зеленому датчику і зі збільшенням температури на кожен градус зменшує швидкість відбору тіла на задану величину.';
export const decrease_cycles_m =
  'Цикли починаються, коли в кубі закінчується спирт, і температура на червоному датчику починає зростати. Допустимо, колона стабілізувалася на температурі 77С, Температура відбору тіла встановлена 1С, гістерезис відбору тіла встановлений 0,5С. Коли температура в червоному датчику досягне 78,5С (77+1+0,5), відбір припинитися і знову відновитися при стабілізації колони до 78С зі швидкістю зменшеною значення «Зменшення за циклами». Допустимо Ви встановили швидкість відбору тіла 20%, після першого циклу вона опуститься до 19%, після другого 18% тощо. Зменшення циклів підходить для процесу ректифікації.';
export const cycles_m =
  'Кількість циклів Старт Стоп, після якого Автоматика вимкне ТЕН і через хвилину вимкне подачу води.';
export const border_cycles_m = 'Максимальний час роботи автоматики по одному циклу Старт Стоп';
export const selection_tails_m = 'Вибір режиму відбору хвостів - або ВУЗОЛ, або КОЛОНА';

//Mashing
export const pauses_m = "Кількість пауз затирання, яке використовуватиметься у цьому процесі затирання. При досягненні температури паузи автоматика буде підтримувати температуру паузи задану кількість часу, після чого перейде до нагрівання до наступної паузи, якщо така задана. Увага, нагрівання до температури паузи відбувається на повній потужності, підтримка паузи за протоколом ПІД регулювання. Щоб уникнути перегріву в момент переходу з режиму нагрівання в режим підтримки, необхідно підібрати гістерезис паузи релевантний для Вашого обладнання.";
export const temp_pause_m = "Температура паузи та порядковий номер паузи затирання. При досягненні температури паузи автоматика буде підтримувати температуру паузи задану кількість часу, після чого перейде до нагрівання до наступної паузи, якщо така задана. Увага, нагрівання до температури паузи відбувається на повній потужності, підтримка паузи за протоколом ПІД регулювання. Щоб уникнути перегріву в момент переходу з режиму нагрівання в режим підтримки, необхідно підібрати гістерезис паузи релевантний для Вашого обладнання.";
export const gist_pause_m = "Гістерезис паузи та порядковий номер паузи, до якої належить цей гістерезис. При нагріванні від однієї паузи до наступної ТЕН працює на повну потужність. І переходить у режим підтримки температури при температурі, яка менша на розмір гістерезиса, від заданої температури паузи. Тому важливо підібрати гістерезис для свого обладнання таким чином, щоб після відключення ТЕНу за рахунок інерції куб догрівався до заданої температури з мінімальним перегрівом.";
export const time_pause_m = "Час проведення та порядковий номер паузи затирання. При досягненні температури паузи, Автоматика перейде в режим ПІД підтримки температури та підтримуватиме її заданий час.";
export const temp_brew_m = "Увага, процес варки не автоматичний, після закінчення процесу затирання оператор повинен промити дробину, після чого дати команду Далі, яка запустить процес варіння сусла. У цьому вікні потрібно встановити температуру варіння. Для досягнення даної температури ТЕН працюватиме на максимумі, а після досягнення перейде до потужності, заданої у вікні «Потужність», для забезпечення необхідної інтенсивності кипіння.";
export const power_brew_m = "Параметр «потужність варки» буде застосований після досягнення параметра «Температура варки», який задається у вікні «Варка». Потужність необхідно підбирати вручну, залежно від обладнання та для забезпечення необхідної інтенсивності кипіння у процесі варки сусла.";
export const time_brew_m = "Даний параметр задає час варки сусла, яке буде здійснено із заданою потужністю, параметр «Потужність». Відлік часу починається після досягнення параметра «Температура варки»";
export const temp_freeze_m = "Температура, до якої автоматика охолодить сусло шляхом подачі охолоджувальної води в чиллер, за допомогою відкриття клапана подачі води. Автоматика подасть воду, відкривши Клапан вода, і проводитиме процес охолодження до заданої температури – розмір гістерезиса. Припустимо, якщо ви встановили температуру охолодження 30С, а гістерезис 3С, вода припинить подаватися при охолодженні до температури 33, подальше охолодження має статися за інерцією. Гістерезис охолодження підбирається для конкретного обладнання.";
export const gist_freeze_m = "Гістерезис охолодження, це різниця між температурою охолодження і фактичною температурою, коли автоматика зупинить подачу води. Припустимо, якщо ви встановили температуру охолодження 30С, а гістерезис 3С, вода припинить подаватися при охолодженні до температури 33, подальше охолодження має статися за інерцією. Гістерезис охолодження підбирається для конкретного обладнання.";

//Settings
export const set_temp_cube_m =
  'Точне коригування датчика температури Куба (Чорний датчик) Для точного коригування помістіть металеву частину датчика в ємність з водою, в цю ж ємність помістіть термометр, якому довіряєте. Кнопками «+» та «-» доведіть температуру датчика до показань термометра.';
export const set_temp_cargi_m =
  'Точне коригування датчика температури Царги (Зелений датчик) Для точного коригування помістіть металеву частину датчика в ємність з водою, в цю ж ємність помістіть термометр, якому довіряєте. Кнопками «+» та «-» доведіть температуру датчика до показань термометра.';
export const set_temp_defl_m =
  'Точне коригування датчика температури Дефлегматора (Червоний датчик) Для точного коригування помістіть металеву частину датчика в ємність з водою, в цю ж ємність помістіть термометр, якому довіряєте. Кнопками «+» та «-» доведіть температуру датчика до показань термометра.';
export const set_temp_water_m =
  'Точне коригування датчика температури Води або Аварійний (Білий датчик) Для точного коригування помістіть металеву частину датчика в ємність з водою, в цю ж ємність помістіть термометр, якому довіряєте. Кнопками «+» та «-» доведіть температуру датчика до показань термометра.';
export const set_warm_m =
  'Положення Потужність для роботи через розетку автоматики зі споживачем не більше 3,5 кВт, Положення Реле для роботи із зовнішнім твердотілим реле або регулятором потужності до 12 кВт.';
export const set_ten_m =
  'Тут необхідно встановити потужність свого ТЕНа, для коректної роботи лічильника кіловат годин.';
export const barometer_m =
  'Дозволяє увімкнути або вимкнути барометр у версіях вище 4,0. Барометр вбудований в автоматику, і при зміні атмосферного тиску зсуває температурну поличку (різниця між температурою роботи та гістерезисом). На розмір зміни температури кипіння спирту при зміні атмосферного тиску.';
export const set_selection_heads_m =
  'Перемикає перехід Автоматики з відбору голів на відбір тіла за оптичним рівнем або за часом, заданим в режимі інтерфейсу, ректифікація.';
export const set_change_heads_m =
  'Дозволяє змінити напрямок відбору голів або вниз, тоді тіло відбиратиметься вбік, або, навпаки, голови відбираються по бічній трубці трійника, а потім тіло відбирається вниз.';
export const set_selection_m =
  'Цей параметр дозволяє перевести Автоматику в режим відбору літрів на годину. Для переведення Автоматики на відбір у літрах за годину необхідно зробити виміри за стандартного режиму %. Для цього запускаємо режим ректифікації, відбираємо голови та в режимі відбору тіла при швидкості 20% робимо кілька вимірювань швидкості для конкретного обладнання. Після закінчення процесу, підраховуємо середнє значення кількох вимірів, швидкості в літрах на годину і вводимо його у вікно «Швидкість відбору при 20%», ТІЛЬКИ ПІСЛЯ ЦИХ ДІЙ АВТОМАТИКУ МОЖНА ПЕРЕВОДИТИ В РЕЖИМ ВІДБОРУ В ЛІТРАХ НА ЧАС!';
export const set_speed_20_m =
  'Тут необхідно запровадити значення швидкості відбору, отримане як ректифікації при «20% відбір тіла». Це означає, що в процесі ректифікації при швидкості відбору тіла 20% ми робимо кілька вимірів. Допустимо отримали два значення 1,25 літра на годину та 1,23 літра на годину. У такому разі вводимо значення 1,24 л/год.';





  
// English Localisation

//Manual Process
export const temp_cube = 'The actual temperature of the cube. Black sensor';
export const temp_cargi = 'The actual temperature of the tank. Green sensor';
export const temp_defl = 'The actual temperature of the retort. Red sensor';
export const temp_water = 'Actual water temperature (emergency sensor). White sensor.';
export const ten =
  'Heater switch (TENU) adjustment of heater power in %. For example, if you have a heating element of 3500 W, then 50% will approximately correspond to a power of 1750 W.';
export const pid =
  'Under the regulator, this function allows you to maintain the exact temperature of the liquid in the cube, within 1 degree. For example, if you turn on the heating element at 50% and the heating element at 70C, the capacity will be heated with an approximate power of 1750 W, after reaching a temperature of 70C, the temperature maintenance mode will be activated.';
export const water =
  'Includes water supply. The valve can be open or closed, it does not regulate the water flow rate! The adjustment of the water pressure must be carried out with the help of a water supply needle valve installed on the column.';
export const selection =
  'Includes main selection valve. The main selection valve regulates the selection speed. For example, if the speed is set to 10%, then the valve is open for 1 second and closed for 9 seconds. If the speed is set to 30%, then the valve is open for 3 seconds and closed for 7 seconds, etc.';
export const heads =
  'Turns the heads valve on and off. The valve can be open or closed, it does not regulate the speed! The valve is used in conjunction with a tee and directs the flow. Heads on one container, body on another.';
export const tails =
  'Includes a tails selection valve. Attention, the tails selection valve is installed only on the lower selection unit, which serves for parallel selection of tails. The tails selection valve regulates the selection speed. For example, if the speed is set to 10%, then the valve is open for 1 second and closed for 9 seconds. If the speed is set to 30%, then the valve is open for 3 seconds and closed for 7 seconds, etc.';
export const water_break =
  'In manual mode, you can set the emergency temperature for any device by the white sensor. The button activates the Emergency mode, the temperature setting sets the operating temperature. When the activation temperature is reached, the heater will be turned off, then after a minute the water supply.';
export const level_break =
'In manual mode, you can set an accident on the optical sensor. The sensor must be fixed on a transparent container (glass or plastic). When the trigger level is reached, the heater will be turned off, then after a minute the water supply will be turned off. Attention, the optical sensor does not work on containers made of colored plastic or metal.';
export const cube_break =
'The button turns on the Emergency mode, the temperature setting sets the temperature of the operation on the black sensor (Cube). When the activation temperature is reached, the heater will be turned off, then after a minute the water supply.';
export const temp_selection =
"When the set limit temperature is reached, the selection will be stopped, the selection will resume if the temperature falls below the 'Selection Hysteresis' value. Let's say the selection temperature is 75C, hysteresis 0.5C. When the temperature reaches 75C, the main selection valve will close, when it drops to 74.5C, the valve will open again with the specified selection speed (selection speed parameter).";

export const gist_selection = 'Temperature range where the main selection valve operates. When the selection temperature is reached, the valve will stop the selection, when the temperature drops by the hysteresis value, the selection will be restored.';

export const speed_selection =
'The selection speed of the main selection valve. For example, if the speed is set to 10%, then the valve is open for 1 second and closed for 9 seconds. If the speed is set to 30%, then the valve is open for 3 seconds and closed for 7 seconds, etc.';
export const speed_selection_tails =
'Tails selection valve selection speed. For example, if the speed is set to 10%, then the valve is open for 1 second and closed for 9 seconds. If the speed is set to 30%, then the valve is open for 3 seconds and closed for 7 seconds, etc.';

//Distillation Process
export const power_acceleration =
'Overclocking the cube to the transition temperature set by the Black sensor. Adjustment of heater power in %. For example, if you have a heating element of 3500 W, then 50% will approximately correspond to a power of 1750 W.';
export const power_selection =
'Goal selection power in % of the power of your TEN, for the GOAL selection mode. For example, if you have a 3 kW heater, then 50% means 1.5 kW.';
export const power_selection_body =
"The power in % of the power of your TEN, for the BODY selection mode. Let's say, if you have a 3 kW TEN, then 50% means 1.5 kW. For the potstill or direct distillation mode, you need to turn off the body selection power, so the distillation will take place at the selection power. To do this, in the 'Body transition' window, select 'Time minutes' and set the value to 0 minutes";
export const time_body_transition =
'After reaching the "Transition temperature" parameter, head selection begins, after the "Body transition min time" time has elapsed, body selection begins. The power changes to the "Body selection power" parameter, the head valve closes, directing the body through the tee into a separate tank. (if "Heads down" is set in the settings). If a sensor level is connected, then the transition will occur according to the sensor level if the tank is filled several hours earlier (if "Heads down" is set in the settings)';
export const temp_breakdown =
'When this temperature is reached (white sensor), the automatic system will turn off the heating element and after one minute will turn off the water supply. It is recommended to install this sensor at the water outlet from the refrigerator.';
export const temp_transition =
'When this temperature is reached in the cube (black sensor), the automation will supply water, reduce the power to the "Extraction power" parameter. Head extraction will begin. The head extraction valve is open (if the Heads are set down)';
export const temp_stop =
'When this temperature is reached in the cube (black sensor), the automation will turn off the heating element and after one minute turn off the water supply.';
export const temp_transition_body =
"After reaching the 'Cube Temperature' parameter, body extraction begins. The power changes to the 'Body Extraction Power' parameter, the heads valve closes, directing the body through the tee into a separate container. (if 'Heads Down' is set in the settings)";

//Rectification
export const temp_selection_heads =
"This parameter is selected automatically after the column stabilization is complete and can be changed later only on the unit's touch screen. This may be necessary if the hysteresis was incorrectly selected during the head selection process or the column was not sufficiently stabilized. In this case, head selection will be stopped and the column will work on its own. To resume the head selection mode, it is necessary to increase the head selection temperature above the current one on the touch screen. Red sensor.";
export const temp_selection_tails =
'The temperature value in the cube (black sensor), upon reaching which the automation will start to remove tails (for automation versions above 4.0) at the speed specified in the "Tails removal speed" window. Attention. Tails are removed ONLY through the lower tails removal unit, which is not included in the Automation delivery set!';
export const temp_selection_body =
'The temperature value in degrees that will be added to the head selection temperature after switching to body selection. Suppose the column has stabilized at a temperature of 77C, with a body selection temperature value of 0.1C, the body selection mode will operate at a temperature of 77.1C.';
export const gist_selection_body =
'Temperature range within which body sampling will take place. When this hysteresis is exceeded, the column will switch to the cycle mode (Start Stop). Sampling will be stopped until the column stabilizes (temperature drops to body sampling temperature + head sampling temperature) and after each hysteresis, the sampling speed will decrease by the value set in the "Cycle Reduction" window. Until the sampling speed reaches zero or the number of cycles set in the "Number of cycles" window has passed. After that, the automation will turn off the heating element and turn off the water supply in one minute.';
export const gist_selection_heads =
'The size of the temperature range within which the automation will select heads after the column has stabilized. When this temperature range is exceeded, the system will stop the selection until the column returns to the stabilization temperature. If after some time the column has not returned to the initial temperature, this means that the equipment has not been properly stabilized and the process can be resumed by increasing the head selection temperature (Only on the touch screen)! Red sensor.';
export const transition_select_body =
"Place the level sensor on a transparent container with the bulb facing outwards. When the level of the heads in the container reaches the center of the sensor, the body selection will switch. The power will change to the body selection power. If the 'Level' heads selection is set in the settings menu";
export const speed_selection_body =
'The body extraction rate is set. The main extraction valve controls the extraction rate. For example, if the rate is set to 10%, the valve is open for 1 second and closed for 9 seconds. If the rate is set to 30%, the valve is open for 3 seconds and closed for 7 seconds, etc.';
export const speed_selection_heads =
'The head selection speed is set. The main selection valve regulates the selection speed. For example, if the speed is set to 10%, the valve is open for 1 second and closed for 9 seconds. If the speed is set to 30%, the valve is open for 3 seconds and closed for 7 seconds, etc.';
export const decrease_selection =
'Temperature in the cube (black sensor) at which the Automation will reduce the sampling rate by the value specified in the "Reduce sampling rate" window';
export const decrease_speed_selection =
'The value by which the automation will reduce the sampling speed when reaching the temperature specified in the Reduction of cubic meter sampling window.';
export const stabilisation_column =
'The column operation time is (without selection) after the end of the acceleration, at the beginning of the head selection process. This is a very important process and it is not recommended to set the column stabilization time too short!';
export const power_selection_tails = 'Tails selection power when tails temperature is reached';
export const temp_selection_cargi = 'Cylinder shell temperature at which selection reduction begins';
export const decrease_speed_cargi =
'Reduction in the extraction rate that occurs after the body extraction begins. This reduces the use for plate columns in distillation mode. After the body extraction begins, the Automation fixes the temperature at the green sensor and, with each degree increase in temperature, reduces the body extraction rate by a given amount.';
export const decrease_cycles =
'Cycles start when the cube runs out of alcohol and the temperature on the red sensor starts to rise. Suppose the column has stabilized at 77C, the Body Selection Temperature is set to 1C, and the Body Selection Hysteresis is set to 0.5C. When the temperature on the red sensor reaches 78.5C (77+1+0.5), selection will stop and resume when the column stabilizes at 78C at a rate reduced by the "Decrease by Cycles" value. Suppose you have set the Body Selection Rate to 20%, after the first cycle it will drop to 19%, after the second 18%, etc. Decreasing cycles is suitable for the rectification process.';
export const cycles =
'Number of Start Stop cycles after which the Automation will turn off the heating element and turn off the water supply after a minute.';
export const border_cycles = 'Maximum operating time of automation for one Start Stop cycle';
export const selection_tails = 'Choose tails selection mode - either NODE or COLUMN';

//Mashing
export const pauses = "The number of mashing pauses that will be used in this mashing process. When the pause temperature is reached, the automation will maintain the pause temperature for the specified amount of time, after which it will switch to heating until the next pause, if one is set. Attention, heating to the pause temperature occurs at full power, pause support according to the PID control protocol. To avoid overheating when switching from heating mode to support mode, it is necessary to select a pause hysteresis relevant to your equipment.";
export const temp_pause = "Pause temperature and the sequence number of the mashing pause. When the pause temperature is reached, the automation will maintain the pause temperature for the specified amount of time, after which it will switch to heating until the next pause, if one is set. Attention, heating to the pause temperature occurs at full power, pause support according to the PID regulation protocol. To avoid overheating when switching from heating mode to support mode, it is necessary to select the pause hysteresis relevant to your equipment.";
export const gist_pause = "Hysteresis of the pause and the serial number of the pause to which this hysteresis belongs. When heating from one pause to the next, the heater operates at full power. And switches to temperature maintenance mode at a temperature that is lower by the size of the hysteresis than the set pause temperature. Therefore, it is important to choose the hysteresis for your equipment in such a way that after the heater is turned off, the cube heats up to the set temperature with minimal overheating due to inertia.";
export const time_pause = "Time and sequence number of the mashing pause. When the pause temperature is reached, the automation will switch to PID temperature maintenance mode and maintain it for the specified time.";
export const temp_brew = "Attention, the brewing process is not automatic, after the mashing process is complete, the operator must rinse the grains, then give the Next command, which will start the wort brewing process. In this window, you need to set the brewing temperature. To reach this temperature, the heating element will operate at maximum, and after reaching it, it will switch to the power set in the 'Power' window to ensure the required boiling intensity.";
export const power_brew = "The 'brewing power' parameter will be applied after reaching the 'Brewing temperature' parameter, which is set in the 'Brewing' window. The power must be selected manually, depending on the equipment and to ensure the necessary boiling intensity during the wort brewing process.";
export const time_brew = "This parameter sets the time for brewing the wort, which will be carried out with the specified power, the 'Power' parameter. The countdown begins after reaching the 'Brewing temperature' parameter";
export const temp_freeze = "The temperature to which the automation will cool the wort by supplying cooling water to the chiller, by opening the water supply valve. The automation will supply water by opening the Water valve, and will carry out the cooling process to the specified temperature - the size of the hysteresis. Suppose, if you set the cooling temperature to 30C, and the hysteresis is 3C, the water will stop being supplied when cooled to a temperature of 33, further cooling should occur by inertia. The cooling hysteresis is selected for the specific equipment.";
export const gist_freeze = "Cooling hysteresis is the difference between the cooling temperature and the actual temperature when the automation stops the water supply. Suppose, if you set the cooling temperature to 30C and the hysteresis is 3C, the water will stop flowing when it cools to a temperature of 33, further cooling should occur by inertia. The cooling hysteresis is selected for the specific equipment.";
//Settings
export const set_temp_cube =
'Fine adjustment of the Cube temperature sensor (Black sensor) For fine adjustment, place the metal part of the sensor in a container of water, and place a thermometer you trust in the same container. Use the "+" and "-" buttons to adjust the sensor temperature to the thermometer reading.';
export const set_temp_cargi =
'Fine adjustment of the Tsarga temperature sensor (Green sensor) For fine adjustment, place the metal part of the sensor in a container of water, and place a thermometer you trust in the same container. Use the "+" and "-" buttons to adjust the sensor temperature to the thermometer reading.';
export const set_temp_defl =
'Fine adjustment of the Dephlegmator temperature sensor (Red sensor) For fine adjustment, place the metal part of the sensor in a container of water, and place a thermometer you trust in the same container. Use the "+" and "-" buttons to adjust the sensor temperature to the thermometer reading.';
export const set_temp_water =
'Fine adjustment of the Water or Emergency (White sensor) temperature sensor For fine adjustment, place the metal part of the sensor in a container of water, and place a thermometer you trust in the same container. Use the "+" and "-" buttons to adjust the sensor temperature to the thermometer reading.';
export const set_warm =
'Power position for operation through an automation socket with a consumer of no more than 3.5 kW, Relay position for operation with an external solid-state relay or power regulator up to 12 kW.';
export const set_ten =
'Here you need to set the power of your heating element for the correct operation of the kilowatt-hour meter.';
export const barometer =
'Allows you to enable or disable the barometer in versions above 4.0. The barometer is built into the automation, and when the atmospheric pressure changes, it shifts the temperature shelf (the difference between the operating temperature and hysteresis). By the amount of change in the boiling point of alcohol when the atmospheric pressure changes.';
export const set_selection_heads =
'Toggles the transition of Automation from head selection to body selection by optical level or by time specified in interface mode, rectification.';
export const set_change_heads =
'Allows you to change the direction of the heads being picked up, either down, then the body will be picked up sideways, or vice versa, the heads are picked up along the side tube of the tee, then the body is picked up down.';
export const set_selection =
'This parameter allows you to switch the Automation to the selection mode in liters per hour. To switch the Automation to the selection in liters per hour, you need to make measurements in the standard % mode. To do this, start the rectification mode, select the heads and in the body selection mode at a speed of 20%, make several speed measurements for a specific equipment. After the process is finished, calculate the average value of several measurements, the speed in liters per hour and enter it in the "Selection speed at 20%" window, ONLY AFTER THESE ACTIONS CAN THE AUTOMATION BE TRANSFERRED TO THE SELECTION MODE IN LITERS PER TIME!';
export const set_speed_20 =
'Here it is necessary to enter the value of the extraction rate obtained as a rectification at "20% body extraction". This means that in the rectification process at a body extraction rate of 20% we make several measurements. Suppose we have obtained two values ​​of 1.25 liters per hour and 1.23 liters per hour. In this case, we enter the value of 1.24 l/h.';
