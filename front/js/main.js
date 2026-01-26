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
}

/**
 * Initialiser les événements de la page d'inscription
 */
function initialiserInscription() {
    console.log('Initialisation de la page d\'inscription');

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
