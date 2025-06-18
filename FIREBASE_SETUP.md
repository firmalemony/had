# Firebase Setup for Snake Game

## Krok 1: Vytvoření Firebase projektu

1. Jděte na https://console.firebase.google.com/
2. Klikněte na "Create a project" nebo "Add project"
3. Zadejte název projektu: `snake-game-global`
4. Můžete vypnout Google Analytics (není potřeba)
5. Klikněte na "Create project"

## Krok 2: Povolení Firestore Database

1. V levém menu klikněte na "Firestore Database"
2. Klikněte na "Create database"
3. Vyberte "Start in test mode" (pro demo)
4. Vyberte umístění (např. europe-west3)
5. Klikněte na "Done"

## Krok 3: Nastavení pravidel

1. V Firestore klikněte na "Rules"
2. Nahraďte pravidla tímto kódem:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /highScores/{document} {
      allow read, write: if true;
    }
  }
}
```

3. Klikněte na "Publish"

## Krok 4: Získání konfigurace

1. V levém menu klikněte na "Project settings" (ozubené kolo)
2. Scrollujte dolů na "Your apps"
3. Klikněte na ikonu webu (</>)
4. Zadejte název: "Snake Game"
5. Klikněte na "Register app"
6. Zkopírujte konfiguraci

## Krok 5: Aktualizace kódu

1. Otevřete soubor `firebase-config.js`
2. Nahraďte placeholder konfiguraci skutečnou konfigurací z Firebase
3. Uložte soubor

## Výsledek

Po nastavení budou skóre ukládána globálně a dostupná pro všechny hráče!

## Bezpečnost

Pro produkci doporučuji nastavit přísnější pravidla v Firestore. 