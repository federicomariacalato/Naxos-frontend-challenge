# Redazione

Piccola interfaccia per sfogliare, cercare e pubblicare post, costruita per la [Naxos Frontend Challenge](./CHALLENGE.md) con React e TypeScript.

## Avvio

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build di produzione
npm run lint
```

Serve Node 20.19 o superiore (oppure 22.12+), come richiede Vite. Nessuna variabile d'ambiente: l'unica API è JSONPlaceholder.

Per vedere gli stati di errore senza staccare la rete, aggiungi un parametro all'URL:

| Parametro              | Effetto                                  |
| ---------------------- | ---------------------------------------- |
| `?simulate=error`      | il caricamento dei post fallisce         |
| `?simulate=post-error` | la pubblicazione di un post fallisce     |
| `?simulate=slow`       | ogni richiesta impiega circa 2,5 secondi |

## Prima di iniziare

1. Per prima cosa metto in piedi il flusso essenziale: lista, loading, errore e form con validazione. Il resto viene dopo.
2. La cosa più importante è che gli stati (caricamento, errore, vuoto, nessun risultato) siano tutti progettati, non solo il caso felice.
3. Come extra scelgo ricerca, ordinamento e paginazione: con 100 post sono i tre strumenti che servono davvero a chi lavora su un archivio.
4. Dubbio: JSONPlaceholder accetta il POST ma non salva nulla. Devo decidere dove far vivere i post creati e dirlo chiaramente all'utente.

## Cosa ho deciso e perché

- **Lista, non griglia di card.** Titoli e testi sono lunghi e si leggono, non si guardano. Una colonna con autore e numero a sinistra rende l'archivio facile da scorrere.
- **Post creati: vera chiamata POST + salvataggio in `localStorage`.** Il form ha un flusso asincrono reale (pending, errore, retry), e il post sopravvive al refresh. È segnalato come «Scritto da te» e il form dice che resta solo su questo browser. L'API risponde sempre `id: 101`, quindi genero io un id univoco.
- **Dopo la pubblicazione** azzero ricerca e ordinamento e vado a pagina 1, così il post nuovo è subito visibile.
- **Ricerca** su titolo e testo, senza distinguere maiuscole e accenti, con 250 ms di debounce e i risultati evidenziati. Mostra il numero di risultati e uno stato vuoto con il pulsante per cancellare.
- **Ricerca, ordinamento e pagina vivono nell'URL**, così un refresh o un link condiviso riportano alla stessa vista.
- **Errori in linguaggio semplice.** Il livello API distingue offline, timeout, errore del server e risposta inattesa, e la UI mostra un messaggio diverso per ciascuno, con «Riprova».
- **Form:** React Hook Form + Zod. Validazione al blur e poi live, spazi bianchi trattati come vuoto, contatori di caratteri, focus sul primo campo errato. Se la pubblicazione fallisce, il testo scritto non va perso. Anche chiudendo il form per sbaglio la bozza resta.
- **Accessibilità di base:** `<dialog>` nativo (focus trap ed `Esc` gratis), label su ogni campo, errori collegati con `aria-describedby`, annunci con `aria-live`, focus visibile, `prefers-reduced-motion` rispettato.
- **Stack:** Vite, React 19, TypeScript strict, Tailwind v4, TanStack Query (cache, retry, annullamento delle richieste), Motion per il toast e la transizione della lista.

## Cosa non ho fatto e perché

- **Modifica ed eliminazione dei post.** Non richiesti, e con un'API che non salva avrebbero richiesto un livello di persistenza più serio.
- **Filtro per autore.** Con ricerca e ordinamento la vista è già completa; il dato c'è (`userId`) e sarebbe un'aggiunta piccola.
- **Router.** Una sola schermata: bastano i parametri dell'URL.
- **Test automatici.** La logica pura (`filterAndSort`, `paginate`, `splitByMatch`) è isolata in `src/lib` apposta per essere testata, ma non l'ho fatto per restare nei tempi.
- **Tema scuro e traduzioni.** L'interfaccia è solo in italiano e solo chiara.

## Trade-off

- `localStorage` è semplice ma legato al browser e non sincronizzato col server. Se il backend fosse reale, userei una mutation con aggiornamento ottimistico e rollback.
- Filtro, ordinamento e paginazione avvengono sul client: va bene per 100 elementi. Per migliaia servirebbero paginazione lato server e ricerca remota.
- Se il caricamento dell'archivio fallisce, i post scritti in locale non vengono mostrati finché non si riprova.

## Cosa migliorerei con più tempo

- Test unitari sulla logica in `src/lib` e un test end-to-end del flusso «scrivi e pubblica».
- Virtualizzazione o paginazione lato server per liste molto più lunghe.
- Eliminare e modificare i post locali, con annulla.
- Filtro per autore.

## Uso di strumenti AI

Ho usato **Claude (Anthropic) tramite Claude Code** per questa soluzione: scelta dell'impostazione grafica, scrittura parziale del codice, verifica manuale nel browser delle schermate e degli stati di errore, e bozza di questo README.
