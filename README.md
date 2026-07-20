# FrikaPay — site vitrine officiel

## Source de vérité

Cette arborescence restaure l’instantané exact du déploiement Vercel de production `584TUB8Xw` (version V23), complété uniquement par les fichiers de gouvernance de source présents dans ce dépôt.

## Règle de travail

- La branche `main` doit toujours représenter la version de production validée.
- Toute évolution doit être développée dans une branche dédiée, testée en prévisualisation Vercel, puis fusionnée dans `main`.
- Ne plus déployer un dossier local divergent sans l’avoir d’abord commité et poussé dans GitHub.
- Le dossier `.vercel/` reste local et ne doit pas être versionné.

## Déploiement

Site statique HTML/CSS/JavaScript.

- Framework Vercel : `Other`
- Répertoire racine : `.`
- Commande de build : aucune
- Répertoire de sortie : `.`
