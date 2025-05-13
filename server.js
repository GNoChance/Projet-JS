const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');

// Configuration du dossier des fichiers statiques
app.use(express.static('public'));

// Configuration de multer pour le téléchargement d'images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Données de exemple
const logements = [
    {
        id: 1,
        titre: "Appartement vue mer à Nice",
        description: "Magnifique appartement avec vue panoramique sur la Méditerranée",
        prix: 120,
        image: "/images/appart1.jpg",
        localisation: {
            lat: 43.7102,
            lng: 7.2620
        }
    },
    {
        id: 2,
        titre: "Chalet cosy dans les Alpes",
        description: "Chalet traditionnel au pied des pistes",
        prix: 200,
        image: "/images/chalet1.jpg",
        localisation: {
            lat: 45.9237,
            lng: 6.8694
        }
    },
    {
        id: 3,
        titre: "Loft design à Paris",
        description: "Superbe loft au cœur du Marais, proche des commerces et transports",
        prix: 180,
        image: "/images/loft1.jpg",
        localisation: {
            lat: 48.8566,
            lng: 2.3522
        }
    },
    {
        id: 4,
        titre: "Villa provençale",
        description: "Magnifique villa avec piscine et jardin méditerranéen",
        prix: 300,
        image: "/images/villa1.jpg",
        localisation: {
            lat: 43.2965,
            lng: 5.3698
        }
    },
    {
        id: 5,
        titre: "Studio vue Tour Eiffel",
        description: "Charmant studio avec vue imprenable sur la Tour Eiffel",
        prix: 150,
        image: "/images/studio1.jpg",
        localisation: {
            lat: 48.8584,
            lng: 2.2945
        }
    }
];

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.render('accueil', { logements });
});

// Route pour la page de détail d'un logement
app.get('/logement/:id', (req, res) => {
    const logement = logements.find(l => l.id === parseInt(req.params.id));
    if (!logement) {
        res.status(404).render('404');
        return;
    }
    res.render('detail', { logement });
});

// Route API pour récupérer les logements
app.get('/api/logements', (req, res) => {
    res.json(logements);
});

// Route pour afficher le formulaire d'ajout
app.get('/ajouter', (req, res) => {
    res.render('ajouter-logement');
});

// Route pour traiter l'ajout d'un logement
app.post('/ajouter-logement', upload.single('image'), (req, res) => {
    const newId = logements.length > 0 ? Math.max(...logements.map(l => l.id)) + 1 : 1;
    
    const newLogement = {
        id: newId,
        titre: req.body.titre,
        description: req.body.description,
        prix: parseInt(req.body.prix),
        image: `/images/uploads/${req.file.filename}`,
        localisation: {
            lat: parseFloat(req.body.lat),
            lng: parseFloat(req.body.lng)
        }
    };

    logements.push(newLogement);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
}); 