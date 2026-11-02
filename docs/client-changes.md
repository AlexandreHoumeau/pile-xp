# Modifications client — validation et mise en service

## Migration Supabase à appliquer manuellement

Le SQL exact est dans
`supabase/migrations/20261102130000_project_display_order.sql`.
Il **n’a pas été appliqué à Supabase** : aucun accès au projet client n’était
configuré dans l’environnement. L’exécuter une seule fois avec le rôle
administrateur dans le SQL Editor ou par le workflow de migrations habituel,
**avant de mettre en service cette version du site**. La migration est atomique.
Elle ne supprime aucun projet ni fichier et ne modifie aucun texte existant.

L’ordre initial reproduit `created_at DESC`, avec `id ASC` pour départager les
ex aequo. Une séquence ajoute les nouveaux projets en fin de liste. Les trous
laissés par les suppressions sont sans incidence. La RPC `reorder_projects`
verrouille les écritures concurrentes, compare la liste attendue à la liste
actuelle, puis change toutes les positions en une transaction. Une liste
périmée/incomplète ou contenant des doublons est rejetée sans changement partiel.
La RPC est réservée à `service_role` et n’est appelée qu’après vérification de
la session signée côté serveur. La clé de service reste côté serveur.

## Résultats et limites

- Glisser-déposer avec poignée séparée du lien d’édition ; clavier Espace/flèches.
- Confirmation de sauvegarde, blocage des déplacements pendant l’écriture,
  relecture de la liste après un échec (y compris une réponse réseau perdue).
- Même tri dans l’administration, le feed, les catégories et les slugs de navigation.
  Les flèches précédent/suivant, auparavant inversées, suivent maintenant cet ordre.
- Icône de contact et logo cliquables ; mention réglementaire et bande rose jusqu’au bord.
  Sur les petits mobiles, le bloc logo occupe la largeur disponible pour rester lisible.
- Les descriptions de l’agence et des projets conservent déjà les vrais retours
  à la ligne : textarea/RHF → action serveur → texte/JSON → rendu `whitespace-pre-line`.
  Les tests couvrent les retours simples et doubles, sauvegarde et relecture.
  Aucun remplacement de texte ni ajout CSS redondant n’a été effectué.
- L’ancien PDF et le PDF de capture n’étaient pas joints à cette session ;
  l’en-tête suit les cinq demandes écrites et conserve les composants existants.

Les validations utilisent exclusivement des données fictives locales. Le build
sans configuration Supabase reste bloqué ; le build avec le simulateur local
passe sous Node.js 26. Il faut encore vérifier la migration, les droits et les
parcours avec le véritable environnement Supabase avant toute mise en service.
Aucun déploiement, push ou changement de données client n’est effectué ici.

Le layout d’administration existant redirige brièvement les accès directs après
rechargement vers `/login`, puis `/admin/projects` pendant la restauration de
l’état d’authentification. Les tests reviennent aux formulaires via la navigation
existante pour vérifier les valeurs sauvegardées ; ce comportement antérieur
n’est pas modifié dans cette intervention.

## Rejouer les vérifications locales

Depuis le dépôt, sous Node.js 26 :

```bash
npm ci
npm run lint
node --test tests/project-reorder.test.mjs
```

Les outils optionnels de validation peuvent être installés hors du dépôt :

```bash
npm install --prefix /tmp/pile-validation @electric-sql/pglite playwright
PGLITE_MODULE=/tmp/pile-validation/node_modules/@electric-sql/pglite/dist/index.js node tests/project-order.mjs
```

Le test SQL utilise une base PostgreSQL en mémoire jetable, et vérifie le tri,
les échanges atomiques, les filtres, les listes invalides/périmées, les ajouts,
suppressions, liste vide et restrictions de rôles. Les tests de l’action serveur
vérifient le refus d’une session absente/invalide, les paramètres, l’appel RPC
unique et les invalidations de pages.

Pour Chromium, lancer dans un premier terminal **un nouveau simulateur** (ses
données sont réinitialisées à chaque démarrage) :

```bash
node tests/fixtures/supabase.mjs
```

Dans un deuxième terminal, exclusivement pour les tests locaux :

```bash
export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
export NEXT_PUBLIC_SUPABASE_ANON_KEY=local-test-anon
export SUPABASE_SERVICE_ROLE_KEY=local-test-service-role
export SESSION_SECRET=local-fixture-session-secret-not-for-production
npm run build
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Ces valeurs sont des marqueurs de simulation, pas des identifiants Supabase.
Ne pas publier ces variables ni les sorties de build produites avec elles.
Dans un troisième terminal :

```bash
PLAYWRIGHT_MODULE=/tmp/pile-validation/node_modules/playwright/index.mjs \
CHROMIUM_PATH=/usr/bin/chromium node tests/client-changes.browser.mjs
```

Le navigateur teste les largeurs 320/375/768/1024/1440, les liens et le menu,
le tri persistant après rechargement, une erreur de sauvegarde, les catégories,
les formulaires multilignes et la navigation entre projets. Les captures sont
écrites dans `/tmp/pile-xp-navbar-*.png`. Le simulateur REST vérifie l’intégration
UI/actions ; les garanties SQL sont testées séparément avec PostgreSQL.
