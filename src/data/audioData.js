// audioData.js - Fichier modifié pour sons hébergés sur Wix
// Ces URLs sont des exemples fonctionnels pour tester le système audio

// URL d'un son Wix existant pour tester
const TEST_AUDIO_URL = "https://static.wixstatic.com/mp3/b9ad46_8c7063409f8f4fe1836a6a7bb5407f49.mp3";

export const themeMusic = {
  1: "https://static.wixstatic.com/mp3/b9ad46_b2e30b69ac3e4765a77fe40f723f9006.mp3",
  2: "https://static.wixstatic.com/mp3/b9ad46_4751955cb29142dd874d1089120796de.mp3",
  3: "https://static.wixstatic.com/mp3/b9ad46_8c7063409f8f4fe1836a6a7bb5407f49.mp3"
};

// Utilisation d'une approche différente: création dynamique
// Associe TOUS les ID possibles au son de test pour garantir que quelque chose se joue
export const dialogueClips = new Proxy({}, {
  get: function(target, name) {
    // Log pour débogage
    console.log("Requested dialogue ID:", name);
    
    // Toujours retourner une URL audio valide
    return TEST_AUDIO_URL;
  }
});

// Exemple explicite pour référence
/*
export const dialogueClips = {
  "Malone_0": TEST_AUDIO_URL,
  "Zadig_2": TEST_AUDIO_URL,
  "Aimé_4": TEST_AUDIO_URL,
  "Zadig_6": TEST_AUDIO_URL,
  "Malone_8": TEST_AUDIO_URL,
  "Birmin_10": TEST_AUDIO_URL,
  "Malone_11": TEST_AUDIO_URL,
  "Birmin_12": TEST_AUDIO_URL
  // Tous les autres identifiants de dialogue suivront le même format et seront automatiquement créés
};
*/

// Ajout d'une fonction utilitaire pour précharger les sons importants
export const preloadAudio = (audioUrls = []) => {
  const audioElements = {};
  
  audioUrls.forEach(url => {
    if (!url) return;
    
    // Créer un élément audio mais ne pas l'ajouter au DOM
    const audio = new Audio();
    audio.src = url;
    audio.preload = 'auto';
    
    // Précharger sans jouer
    audio.load();
    
    // Stocker la référence
    audioElements[url] = audio;
  });
  
  return audioElements;
};

// Précharger les thèmes musicaux (optionnel, à utiliser dans App.jsx si nécessaire)
export const preloadThemes = () => {
  const themesToPreload = Object.values(themeMusic);
  return preloadAudio(themesToPreload);
};