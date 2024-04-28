import { Website, Page } from './types';

var count = 1;

export const WEBSITES: Website[] = [
    { 
        _id: 1, 
        name: 'Netflix', 
        URL: 'https://www.netflix.com', 
        pages: [
            { _id: count++, page_URL: 'https://www.netflix.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.netflix.com/Browse', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.netflix.com/Search', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 2, 
        name: 'FCUL', 
        URL: 'https://ciencias.ulisboa.pt/', 
        pages: [
           {  _id: count++, page_URL: 'https://ciencias.ulisboa.pt/PáginaInicial', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://ciencias.ulisboa.pt/Cursos', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://ciencias.ulisboa.pt/Investigação', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 3, 
        name: 'Fénix FCUL', 
        URL: 'https://fenix.ciencias.ulisboa.pt/', 
        pages: [
           {  _id: count++, page_URL: 'https://fenix.ciencias.ulisboa.pt/PáginaInicial', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://fenix.ciencias.ulisboa.pt/Turmas', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://fenix.ciencias.ulisboa.pt/Avaliações', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 4, 
        name: 'Amazon', 
        URL: 'https://www.amazon.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.amazon.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.amazon.com/Categories', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.amazon.com/YourAccount', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 5, 
        name: 'OLX', 
        URL: 'https://www.olx.pt/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.olx.pt/PáginaInicial', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.olx.pt/Anúncios', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.olx.pt/MinhaConta', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 6, 
        name: 'Wikipedia', 
        URL: 'https://www.wikipedia.org/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.wikipedia.org/MainPage', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.wikipedia.org/RandomArticle', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.wikipedia.org/RecentChanges', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 7, 
        name: 'Google', 
        URL: 'https://www.google.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.google.com/Search', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.google.com/Maps', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.google.com/Gmail', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 8, 
        name: 'YouTube', 
        URL: 'https://www.youtube.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.youtube.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.youtube.com/Trending', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.youtube.com/Subscriptions', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 9, 
        name: 'Facebook', 
        URL: 'https://www.facebook.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.facebook.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.facebook.com/Profile', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.facebook.com/Friends', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 10, 
        name: 'Twitter', 
        URL: 'https://twitter.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://twitter.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://twitter.com/Explore', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://twitter.com/Notifications', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 11, 
        name: 'Instagram', 
        URL: 'https://www.instagram.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.instagram.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.instagram.com/Explore', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.instagram.com/Profile', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 12, 
        name: 'LinkedIn', 
        URL: 'https://www.linkedin.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.linkedin.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.linkedin.com/MyNetwork', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.linkedin.com/Jobs', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 13, 
        name: 'GitHub', 
        URL: 'https://github.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://github.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://github.com/Explore', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://github.com/PullRequests', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 14, 
        name: 'Twitch', 
        URL: 'https://www.twitch.tv/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.twitch.tv/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.twitch.tv/Browse', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.twitch.tv/Following', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 15, 
        name: 'Microsoft', 
        URL: 'https://www.microsoft.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.microsoft.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.microsoft.com/Products', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.microsoft.com/Support', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 16, 
        name: 'Apple', 
        URL: 'https://www.apple.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.apple.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.apple.com/Products', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.apple.com/Support', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 17, 
        name: 'Reddit', 
        URL: 'https://www.reddit.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.reddit.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.reddit.com/Popular', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.reddit.com/All', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 18, 
        name: 'Snapchat', 
        URL: 'https://www.snapchat.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.snapchat.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.snapchat.com/Friends', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.snapchat.com/Discover', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 19, 
        name: 'Pinterest', 
        URL: 'https://www.pinterest.com/', 
        pages: [
           {  _id: count++, page_URL: 'https://www.pinterest.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.pinterest.com/Following', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           {  _id: count++, page_URL: 'https://www.pinterest.com/Pins', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }
        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    },
    { 
        _id: 20, 
        name: 'WhatsApp', 
        URL: 'https://www.whatsapp.com/', 
        pages: [
           { _id: count++, page_URL: 'https://www.whatsapp.com/Home', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           { _id: count++, page_URL: 'https://www.whatsapp.com/Chats', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           { _id: count++, page_URL: 'https://www.whatsapp.com/Status', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           { _id: count++, page_URL: 'https://www.whatsapp.com/alo1', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() },
           { _id: count++, page_URL: 'https://www.whatsapp.com/alo2', eval_date: randomDate(new Date(2019, 0, 1), new Date()), monitor_state: randomState() }

        ], 
        register_date: randomDate(new Date(2019, 0, 1), new Date()), 
        eval_date: randomDate(new Date(2019, 0, 1), new Date()), 
        monitor_state: randomState()
    }
];

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomState(): string {
    const states = ['to be evaluated', 'under evaluation', 'evaluated', 'error in evaluation'];
    const index = Math.floor(Math.random() * states.length);
    return states[index];
}
