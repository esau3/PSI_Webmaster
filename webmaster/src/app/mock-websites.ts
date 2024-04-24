import { Website } from './types';

export const WEBSITES: Website[] = [
    { 
        id: 1, 
        name: 'Netflix', 
        URL: 'https://www.netflix.com', 
        pages: ['Home', 'Browse', 'Search'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), // Data aleatória entre 2019 e hoje
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), // Data aleatória entre 2019 e hoje
        monitor_state: randomState()
    },
    { 
        id: 2, 
        name: 'FCUL', 
        URL: 'https://ciencias.ulisboa.pt/', 
        pages: ['Página Inicial', 'Cursos', 'Investigação'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 3, 
        name: 'Fénix FCUL', 
        URL: 'https://fenix.ciencias.ulisboa.pt/', 
        pages: ['Página Inicial', 'Turmas', 'Avaliações'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 4, 
        name: 'Amazon', 
        URL: 'https://www.amazon.com/', 
        pages: ['Home', 'Categories', 'Your Account'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 5, 
        name: 'OLX', 
        URL: 'https://www.olx.pt/', 
        pages: ['Página Inicial', 'Anúncios', 'Minha Conta'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 6, 
        name: 'Wikipedia', 
        URL: 'https://www.wikipedia.org/', 
        pages: ['Main Page', 'Random article', 'Recent changes'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 7, 
        name: 'Google', 
        URL: 'https://www.google.com/', 
        pages: ['Search', 'Maps', 'Gmail'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 8, 
        name: 'YouTube', 
        URL: 'https://www.youtube.com/', 
        pages: ['Home', 'Trending', 'Subscriptions'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 9, 
        name: 'Facebook', 
        URL: 'https://www.facebook.com/', 
        pages: ['Home', 'Profile', 'Friends'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 10, 
        name: 'Twitter', 
        URL: 'https://twitter.com/', 
        pages: ['Home', 'Explore', 'Notifications'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 11, 
        name: 'Instagram', 
        URL: 'https://www.instagram.com/', 
        pages: ['Home', 'Explore', 'Profile'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 12, 
        name: 'LinkedIn', 
        URL: 'https://www.linkedin.com/', 
        pages: ['Home', 'My Network', 'Jobs'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 13, 
        name: 'GitHub', 
        URL: 'https://github.com/', 
        pages: ['Home', 'Explore', 'Pull requests'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 14, 
        name: 'Twitch', 
        URL: 'https://www.twitch.tv/', 
        pages: ['Home', 'Browse', 'Following'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 15, 
        name: 'Microsoft', 
        URL: 'https://www.microsoft.com/', 
        pages: ['Home', 'Products', 'Support'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 16, 
        name: 'Apple', 
        URL: 'https://www.apple.com/', 
        pages: ['Home', 'Products', 'Support'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 17, 
        name: 'Reddit', 
        URL: 'https://www.reddit.com/', 
        pages: ['Home', 'Popular', 'All'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 18, 
        name: 'Snapchat', 
        URL: 'https://www.snapchat.com/', 
        pages: ['Home', 'Friends', 'Discover'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 19, 
        name: 'Pinterest', 
        URL: 'https://www.pinterest.com/', 
        pages: ['Home', 'Following', 'Pins'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        id: 20, 
        name: 'WhatsApp', 
        URL: 'https://www.whatsapp.com/', 
        pages: ['Home', 'Chats', 'Status'], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    }
];

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomState(): string {
    const states = ['under evaluation', 'evaluated', 'error in evaluation'];
    const index = Math.floor(Math.random() * states.length);
    return states[index];
}
