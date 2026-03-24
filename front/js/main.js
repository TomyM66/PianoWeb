<<<<<<< HEAD
'use strict';

const API = '/api';

document.addEventListener('DOMContentLoaded', () => {

    // ── Connexion ──
    const btnConnecter = document.getElementById('btn-connecter');
    if (btnConnecter) {
        btnConnecter.addEventListener('click', connecter);
        document.addEventListener('keypress', e => { if (e.key === 'Enter') connecter(); });
    }

    // ── Inscription ──
    const btnInscrire = document.getElementById('btn-inscrire');
    if (btnInscrire) {
        btnInscrire.addEventListener('click', inscrire);
        document.addEventListener('keypress', e => { if (e.key === 'Enter') inscrire(); });
    }

});

async function connecter() {
    const email     = document.getElementById('email').value.trim();
    const code      = document.getElementById('code').value.trim();
    const messageEl = document.getElementById('message');

    if (!email || !code) {
        afficherMessage(messageEl, 'Veuillez remplir tous les champs', 'error');
        return;
    }

    try {
        const res  = await fetch(`${API}/connexion`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email, code })
        });
        const data = await res.json();

        if (res.ok) {
            sessionStorage.setItem('utilisateurConnecte', JSON.stringify(data.utilisateur));
            afficherMessage(messageEl, 'Connexion réussie !', 'success');
            setTimeout(() => { window.location.href = 'chopchopin.html'; }, 1000);
        } else {
            afficherMessage(messageEl, data.erreur || 'Erreur inconnue', 'error');
        }
    } catch (e) {
        afficherMessage(messageEl, 'Impossible de contacter le serveur', 'error');
    }
}

async function inscrire() {
    const pseudo    = document.getElementById('pseudo').value.trim();
    const email     = document.getElementById('email').value.trim();
    const code      = document.getElementById('code').value.trim();
    const messageEl = document.getElementById('message');

    if (!pseudo || !email || !code) {
        afficherMessage(messageEl, 'Veuillez remplir tous les champs', 'error');
        return;
    }

    try {
        const res  = await fetch(`${API}/inscription`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ pseudo, email, code })
        });
        const data = await res.json();

        if (res.ok) {
            afficherMessage(messageEl, 'Inscription réussie !', 'success');
            document.getElementById('pseudo').value = '';
            document.getElementById('email').value  = '';
            document.getElementById('code').value   = '';
            setTimeout(() => { window.location.href = 'accueil.html'; }, 2000);
        } else {
            afficherMessage(messageEl, data.erreur || 'Erreur inconnue', 'error');
        }
    } catch (e) {
        afficherMessage(messageEl, 'Impossible de contacter le serveur', 'error');
    }
}

function afficherMessage(el, texte, type) {
    el.textContent   = texte;
    el.className     = `message ${type}`;
    el.style.display = 'block';
}
=======
// ============================================
// SYSTÈME DE CHARGEMENT DYNAMIQUE DES PAGES
// ============================================

/**
 * Fonction pour charger un fichier CSS dynamiquement
 * @param {string} fichierCSS - Chemin du fichier CSS à charger
 */
function chargerCSS(fichierCSS) {
    // Supprimer l'ancien CSS si existant
    const ancien = document.getElementById('css-dynamique');
    if (ancien) ancien.remove();

    // Ajouter le nouveau CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fichierCSS;
    link.id = 'css-dynamique';
    document.head.appendChild(link);
}

/**
 * Fonction pour charger une page HTML dans le conteneur principal
 * @param {string} pageName - Le nom de la page à charger (sans extension)
 */
function chargerPage(pageName) {
    // Charger le CSS correspondant à la page
    if (pageName === 'accueil') {
        chargerCSS('front/css/style.css');
    } else if (pageName === 'chopchopin') {
        chargerCSS('front/css/style-a.css');
    } else {
        chargerCSS('front/css/style-c.css');
    }

    const app = document.getElementById('app');

    // Afficher un indicateur de chargement
    app.innerHTML = '<div class="container"><div class="welcome-card"><p>Chargement...</p></div></div>';

    // Charger la page demandée depuis le dossier front/html/
    fetch(`front/html/${pageName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Page ${pageName}.html introuvable`);
            }
            return response.text();
        })
        .then(html => {
            // Extraire le contenu du body de la page chargée
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const contenu = doc.body.innerHTML;

            app.innerHTML = contenu;
            console.log(`Page ${pageName}.html chargée avec succès`);

            // Initialiser les événements de la page chargée
            initialiserEvenements(pageName);
        })
        .catch(error => {
            console.error('Erreur lors du chargement de la page:', error);
            app.innerHTML = `
                <div class="container">
                    <div class="welcome-card">
                        <h2>Erreur de chargement</h2>
                        <p>Impossible de charger la page ${pageName}.html</p>
                        <button onclick="chargerPage('accueil')" class="link">Retour à l'accueil</button>
                    </div>
                </div>
            `;
        });
}

/**
 * Initialiser les événements spécifiques à chaque page
 * @param {string} pageName - Le nom de la page actuellement chargée
 */
function initialiserEvenements(pageName) {
    switch(pageName) {
        case 'accueil':
            initialiserAccueil();
            break;
        case 'connexion':
            initialiserConnexion();
            break;
        case 'inscription':
            initialiserInscription();
            break;
        case 'chopchopin':
            initialiserChopchopin();
            break;
        default:
            console.log(`Aucun événement spécifique pour ${pageName}`);
    }
}

/**
 * Initialiser les événements de la page d'accueil
 */
function initialiserAccueil() {
    console.log('Initialisation de la page d\'accueil');

    // Intercepter les clics sur les liens pour utiliser le chargement dynamique
    const liens = document.querySelectorAll('.links .link');

    liens.forEach(lien => {
        lien.addEventListener('click', (e) => {
            e.preventDefault();
            const href = lien.getAttribute('href');

            if (href.includes('inscription.html')) {
                chargerPage('inscription');
            } else if (href.includes('connexion.html')) {
                chargerPage('connexion');
            }
        });
    });
}

/**
 * Initialiser les événements de la page de connexion
 */
function initialiserConnexion() {
    console.log('Initialisation de la page de connexion');

    // Gérer les liens de retour
    const liens = document.querySelectorAll('a');
    liens.forEach(lien => {
        lien.addEventListener('click', (e) => {
            const href = lien.getAttribute('href');
            if (href && href.endsWith('.html')) {
                e.preventDefault();
                const pageName = href.replace('.html', '');
                chargerPage(pageName);
            }
        });
    });

    // La fonction connecter() est déjà définie dans le HTML inline
    // On la redéfinit ici pour utiliser le système de navigation
    window.connecter = function() {
        const email = document.getElementById('email').value;
        const code = document.getElementById('code').value;
        const messageEl = document.getElementById('message');

        if (!email || !code) {
            messageEl.textContent = 'Veuillez remplir tous les champs';
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
            return;
        }

        // Vérifier si l'utilisateur existe dans localStorage
        const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
        const utilisateur = utilisateurs.find(u => u.email === email && u.code === code);

        if (utilisateur) {
            // Connexion réussie
            sessionStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateur));
            messageEl.textContent = 'Connexion réussie !';
            messageEl.className = 'message success';
            messageEl.style.display = 'block';

            setTimeout(() => {
                chargerPage('chopchopin');
            }, 1000);
        } else {
            messageEl.textContent = 'Email ou code incorrect';
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
        }
    };
}

/**
 * Initialiser les événements de la page d'inscription
 */
function initialiserInscription() {
    console.log('Initialisation de la page d\'inscription');

    // Gérer les liens de retour
    const liens = document.querySelectorAll('a');
    liens.forEach(lien => {
        lien.addEventListener('click', (e) => {
            const href = lien.getAttribute('href');
            if (href && href.endsWith('.html')) {
                e.preventDefault();
                const pageName = href.replace('.html', '');
                chargerPage(pageName);
            }
        });
    });

    // Redéfinir la fonction inscrire() pour utiliser localStorage
    window.inscrire = function() {
        const pseudo = document.getElementById('pseudo').value;
        const email = document.getElementById('email').value;
        const code = document.getElementById('code').value;
        const messageEl = document.getElementById('message');

        if (!pseudo || !email || !code) {
            messageEl.textContent = 'Veuillez remplir tous les champs';
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
            return;
        }

        // Vérifier si l'email existe déjà
        const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
        const emailExiste = utilisateurs.some(u => u.email === email);

        if (emailExiste) {
            messageEl.textContent = 'Cet email est déjà utilisé';
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
            return;
        }

        // Ajouter le nouvel utilisateur
        utilisateurs.push({ pseudo, email, code, partitions: [] });
        localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));

        messageEl.textContent = 'Inscription réussie !';
        messageEl.className = 'message success';
        messageEl.style.display = 'block';

        // Vider les champs
        document.getElementById('pseudo').value = '';
        document.getElementById('email').value = '';
        document.getElementById('code').value = '';

        setTimeout(() => {
            chargerPage('accueil');
        }, 2000);
    };
}

// ============================================
// FONCTIONNALITÉS DU PIANO VIRTUEL
// ============================================

let audioContext;
let currentlyPlaying = [];

// Mapping des notes avec leurs fréquences
const noteFrequencies = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88,
    'Do': 261.63, 'Do#': 277.18, 'Ré': 293.66, 'Ré#': 311.13,
    'Mi': 329.63, 'Fa': 349.23, 'Fa#': 369.99, 'Sol': 392.00,
    'Sol#': 415.30, 'La': 440.00, 'La#': 466.16, 'Si': 493.88
};

// Mapping clavier vers notes
const keyboardMap = {
    'a': 'C', 'z': 'C#', 'e': 'D', 'r': 'D#', 't': 'E',
    'y': 'F', 'u': 'F#', 'i': 'G', 'o': 'G#', 'p': 'A',
    'q': 'A#', 's': 'B'
};

/**
 * Initialiser l'AudioContext
 */
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

/**
 * Jouer une note avec une fréquence donnée
 */
function playSound(frequency, duration = 0.5) {
    initAudioContext();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    return { oscillator, gainNode };
}

/**
 * Créer le piano virtuel
 */
function creerPiano() {
    const piano = document.getElementById('piano');
    if (!piano) return;

    piano.innerHTML = '';
    
    // Définition des notes du piano (3 octaves)
    const notes = [
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
    ];
    
    notes.forEach((note, index) => {
        const isBlack = note.includes('#');
        const octave = Math.floor(index / 12);
        const frequency = noteFrequencies[note] * Math.pow(2, octave);
        
        if (isBlack) {
            const blackKey = document.createElement('div');
            blackKey.className = 'black-key';
            blackKey.dataset.note = note;
            blackKey.dataset.frequency = frequency;
            blackKey.style.left = `${(index - Math.floor(index / 12) * 0.5) * 50 - 16}px`;
            
            blackKey.addEventListener('mousedown', () => jouerTouche(blackKey, frequency));
            blackKey.addEventListener('mouseup', () => arreterTouche(blackKey));
            blackKey.addEventListener('mouseleave', () => arreterTouche(blackKey));
            
            piano.appendChild(blackKey);
        } else {
            const whiteKey = document.createElement('div');
            whiteKey.className = 'white-key';
            whiteKey.dataset.note = note;
            whiteKey.dataset.frequency = frequency;
            whiteKey.textContent = note;
            
            whiteKey.addEventListener('mousedown', () => jouerTouche(whiteKey, frequency));
            whiteKey.addEventListener('mouseup', () => arreterTouche(whiteKey));
            whiteKey.addEventListener('mouseleave', () => arreterTouche(whiteKey));
            
            piano.appendChild(whiteKey);
        }
    });
}

/**
 * Jouer une touche du piano
 */
function jouerTouche(element, frequency) {
    element.classList.add('playing');
    playSound(frequency);
}

/**
 * Arrêter une touche du piano
 */
function arreterTouche(element) {
    element.classList.remove('playing');
}

/**
 * Jouer les notes depuis le textarea
 */
function playNotes() {
    const textarea = document.getElementById('noteInput');
    if (!textarea) return;
    
    const text = textarea.value;
    const notes = text.split(/\s+/).filter(n => n.length > 0);
    
    if (notes.length === 0) {
        alert('Veuillez entrer des notes à jouer');
        return;
    }
    
    playSequence(notes);
}

/**
 * Jouer une séquence de notes
 */
function playSequence(notes, tempo = 500) {
    notes.forEach((note, index) => {
        setTimeout(() => {
            const frequency = noteFrequencies[note] || noteFrequencies['C'];
            playSound(frequency, 0.4);
            
            // Animer la touche correspondante sur le piano
            const touches = document.querySelectorAll(`[data-note="${note}"]`);
            if (touches.length > 0) {
                touches[0].classList.add('playing');
                setTimeout(() => touches[0].classList.remove('playing'), 300);
            }
        }, index * tempo);
    });
}

/**
 * Transférer les notes vers la partition
 */
function transferToPartition() {
    const textarea = document.getElementById('noteInput');
    const sheetMusic = document.getElementById('sheetMusic');
    
    if (!textarea || !sheetMusic) return;
    
    const notes = textarea.value;
    if (notes.trim().length === 0) {
        alert('Veuillez entrer des notes à transférer');
        return;
    }
    
    sheetMusic.innerHTML = `<pre>${notes}</pre>`;
}

/**
 * Jouer la partition
 */
function playPartition() {
    const sheetMusic = document.getElementById('sheetMusic');
    const playIndicator = document.getElementById('playIndicator');
    
    if (!sheetMusic) return;
    
    const text = sheetMusic.textContent;
    const notes = text.split(/\s+/).filter(n => n.length > 0 && noteFrequencies[n]);
    
    if (notes.length === 0) {
        alert('Aucune partition valide à jouer');
        return;
    }
    
    playIndicator.classList.add('active');
    playSequence(notes);
    
    setTimeout(() => {
        playIndicator.classList.remove('active');
    }, notes.length * 500 + 500);
}

/**
 * Effacer les notes
 */
function clearNotes() {
    const textarea = document.getElementById('noteInput');
    if (textarea) {
        textarea.value = '';
    }
}

/**
 * Importer une partition
 */
function importPartition() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const sheetMusic = document.getElementById('sheetMusic');
            if (sheetMusic) {
                sheetMusic.innerHTML = `<pre>${event.target.result}</pre>`;
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

/**
 * Ouvrir un fichier
 */
function openFile() {
    importPartition();
}

/**
 * Sauvegarder un fichier
 */
function saveFile() {
    const sheetMusic = document.getElementById('sheetMusic');
    if (!sheetMusic) return;
    
    const contenu = sheetMusic.textContent;
    const blob = new Blob([contenu], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'partition.txt';
    a.click();
    
    URL.revokeObjectURL(url);
}

/**
 * Déconnexion
 */
function disconnect() {
    sessionStorage.removeItem('utilisateurConnecte');
    chargerPage('accueil');
}

/**
 * Toggle menu hamburger
 */
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

/**
 * Initialiser la page ChopChopin (piano)
 */
function initialiserChopchopin() {
    console.log('Initialisation de la page ChopChopin (Piano)');
    
    // Créer le piano
    creerPiano();
    
    // Vérifier si l'utilisateur est connecté
    const utilisateur = JSON.parse(sessionStorage.getItem('utilisateurConnecte') || 'null');
    if (!utilisateur) {
        alert('Vous devez être connecté pour accéder à cette page');
        chargerPage('connexion');
        return;
    }
    
    // Ajouter la gestion du clavier
    document.addEventListener('keydown', (e) => {
        const note = keyboardMap[e.key.toLowerCase()];
        if (note) {
            const frequency = noteFrequencies[note];
            const touches = document.querySelectorAll(`[data-note="${note}"]`);
            if (touches.length > 0) {
                jouerTouche(touches[0], frequency);
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        const note = keyboardMap[e.key.toLowerCase()];
        if (note) {
            const touches = document.querySelectorAll(`[data-note="${note}"]`);
            if (touches.length > 0) {
                arreterTouche(touches[0]);
            }
        }
    });
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('dropdownMenu');
        const btn = document.querySelector('.hamburger-btn');
        if (menu && !menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove('active');
        }
    });
}

/**
 * Fonction d'initialisation principale
 */
function initialiser() {
    console.log('🎵 Démarrage de l\'application ChopChopin');
    chargerPage('accueil');
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiser);
} else {
    initialiser();
}

// Exposer les fonctions nécessaires globalement
window.chargerPage = chargerPage;
window.playNotes = playNotes;
window.transferToPartition = transferToPartition;
window.playPartition = playPartition;
window.clearNotes = clearNotes;
window.importPartition = importPartition;
window.openFile = openFile;
window.saveFile = saveFile;
window.disconnect = disconnect;
window.toggleMenu = toggleMenu;
>>>>>>> b346799934714b933c65d960bac0a1d09ab3a1d0
