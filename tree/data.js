function getData(number) {
    let data = [];
    data[0] =  [
        ["Toothed", "Hair", "Breathes", "Legs", "species"],
        ["Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Not Hair", "Breathes", "Not Legs", "Reptile"],
        ["Not Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Not Hair", "Not Breathes", "Not Legs", "Reptile"],
        ["Toothed", "Not Hair", "Breathes", "Not Legs", "Reptile"],
        ["Toothed", "Not Hair", "Breathes", "Legs", "Mammal"],
        ["Not Toothed", "Not Hair", "Breathes", "Legs", "Reptile"]
    
    ];
    
    
    data[1] = [
        ["Соперник",    "Играем",       "Лидеры",       "Дождь",    "Победа"    ],
        ["Выше",        "Дома",         "На месте",     "Да",       "Нет"       ],
        ["Выше",        "Дома",         "На месте",     "Нет",      "Да"        ],
        ["Выше",        "Дома",         "Пропускают",   "Нет",      "Нет"       ],
        ["Ниже",        "Дома",         "Пропускают",   "Нет",      "Да"        ],
        ["Ниже",        "В гостях",     "Пропускают",   "Нет",      "Нет"       ],
        ["Ниже",        "Дома",         "Пропускают",   "Да",       "Да"        ],
        ["Выше",        "В гостях",     "На месте",     "Да",       "Нет"       ],
        ["Ниже",        "В гостях",     "На месте",     "Нет",      "Да"        ]
    ];
    
    data[3] = [
        ["Осадки",          "Температура",  "Влажность",    "Ветер",    "Класс"     ],
        ["Солнечно",        "Жарко",        "Высокая",      "Нет",      "Не играть" ],
        ["Солнечно",        "Жарко",        "Высокая",      "Да",       "Не играть" ],
        ["П. облачность",   "Жарко",        "Высокая",      "Нет",      "Играть"    ],
        ["Пасмурно",        "Умеренно",     "Высокая",      "Нет",      "Играть"    ],
        ["Пасмурно",        "Прохладно",    "Нормальная",   "Нет",      "Играть"    ],
        ["Пасмурно",        "Прохладно",    "Нормальная",   "Да",       "Не играть" ],
        ["П. облачность",   "Прохладно",    "Нормальная",   "Да",       "Играть"    ],
        ["Солнечно",        "Умеренно",     "Высокая",      "Нет",      "Не играть" ],
        ["Солнечно",        "Прохладно",    "Нормальная",   "Нет",      "Играть"    ],
        ["Пасмурно",        "Умеренно",     "Нормальная",   "Нет",      "Играть"    ],
        ["Солнечно",        "Умеренно",     "Нормальная",   "Да",       "Играть"    ],
        ["П. облачность",   "Умеренно",     "Высокая",      "Да",       "Играть"    ],
        ["П. облачность",   "Жарко",        "Нормальная",   "Нет",      "Играть"    ],
        ["Пасмурно",        "Умеренно",     "Высокая",      "Да",       "Не играть" ]
    ];
    
    data[2] = [
        ["usd",     "lamphat",  "nctt",     "slkt",     "play " ],
        ["TANG",    "GIAM",     "THAP",     "TB",       "THAP " ],
        ["TANG",    "TANG",     "THAP",     "TB",       "CAO "  ],
        ["TANG",    "ON DINH",  "CAO",      "TB",       "CAO "  ],
        ["TANG",    "TANG",     "THAP",     "THAP",     "CAO "  ],
        ["TANG",    "GIAM",     "TB",       "THAP",     "CAO "  ],
        ["TANG",    "GIAM",     "CAO",      "THAP",     "THAP " ],
        ["TB",      "ON DINH",  "TB",       "CAO",      "THAP " ],
        ["TB",      "GIAM",     "THAP",     "CAO",      "THAP " ],
        ["TB",      "TANG",     "TB",       "THAP",     "THAP " ],
        ["TB",      "ON DINH",  "CAO",      "TB",       "CAO "  ],
        ["TB",      "GIAM",     "CAO",      "CAO",      "CAO "  ],
        ["GIAM",    "ON DINH",  "CAO",      "THAP",     "THAP " ],
        ["GIAM",    "GIAM",     "CAO",      "CAO",      "CAO "  ],
        ["GIAM",    "TANG",     "CAO",      "TB",       "THAP " ],
        ["GIAM",    "TANG",     "THAP",     "THAP",     "THAP " ],
        ["GIAM",    "ON DINH",  "CAO",      "TB",       "CAO "  ]
    ];

    return data[number]
}
