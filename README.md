# Daily Bodh

A fully offline, personal-use Android app that shows one shloka or one thought per
day on your home screen. Built with **Kotlin + Jetpack Compose** (the app) and
**Jetpack Glance** (the home-screen widget).

## Privacy, by construction

* **No `INTERNET` permission** is declared in the manifest, so the app physically
  cannot reach the network.
* No login, no accounts, no analytics, no ads, no tracking, no crash reporting.
* All content ships inside the app as JSON in `assets/content/`.
* All settings live on the device in DataStore (and in each widget's own store).

The About screen in the app says exactly this: *"No data is collected. Works fully offline."*

---

## Project structure

```
DailyBodh/
.gitignore
build.gradle.kts
gradle.properties
settings.gradle.kts
gradle/
  wrapper/
    gradle-wrapper.properties
app/
  build.gradle.kts
  proguard-rules.pro
  src/
    main/
      AndroidManifest.xml
      res/
        values/
          colors.xml
          strings.xml
          themes.xml
        xml/
          backup_rules.xml
          daily_bodh_widget_info.xml
          data_extraction_rules.xml
          file_paths.xml
        drawable/
          ic_launcher_foreground.xml
          widget_preview.xml
        mipmap-anydpi-v26/
          ic_launcher.xml
          ic_launcher_round.xml
      java/
        com/
          dailybodh/
            app/
              DailyBodhApp.kt
              MainActivity.kt
              data/
                ContentPicker.kt
                ContentRepository.kt
                PackRegistry.kt
                SettingsRepository.kt
                WidgetSettings.kt
                model/
                  ContentItem.kt
                  PackFile.kt
              widget/
                DailyBodhWidget.kt
                DailyBodhWidgetReceiver.kt
                NextItemAction.kt
                WidgetConfigActivity.kt
                WidgetScheduler.kt
                WidgetStateStore.kt
                WidgetUpdateWorker.kt
              ui/
                DailyBodhNavHost.kt
                MainViewModel.kt
                theme/
                  Theme.kt
                screens/
                  AboutScreen.kt
                  Common.kt
                  DetailScreen.kt
                  FavoritesScreen.kt
                  HomeScreen.kt
                  PackLibraryScreen.kt
                  WidgetSettingsScreen.kt
                components/
                  WidgetCustomizer.kt
              util/
                ShareAsImage.kt
      assets/
        content/
          business_quotes.json
          gentleman.json
          gita.json
          leadership.json
          motivation.json
          osho.json
          self_discipline.json
docs/
  content-schema.json
```

A quick tour of the parts that matter:

* `data/` — content loading (`ContentRepository`), the daily pick logic
  (`ContentPicker`), the pack list (`PackRegistry`), the per-widget settings model
  (`WidgetSettings`) and the local store (`SettingsRepository`).
* `widget/` — the Glance widget (`DailyBodhWidget`), its receiver, the
  first-placement / reconfiguration screen (`WidgetConfigActivity`), the
  "next item" tap action and the midnight refresh worker.
* `ui/` — Compose screens: Home, Pack library, Widget settings, Favorites, About,
  and the full-screen detail view with Favorite and Share-as-image.
* `assets/content/` — your editable content packs.

---

## Requirements

* Android Studio **Koala (2024.1)** or newer, or just the command-line tools.
* JDK **17**.
* Android SDK with **API 34** platform + build-tools installed.
* `minSdk 26` (Android 8.0) and up.

## Build steps

### Option A - Android Studio

1. `File > Open` and select the `DailyBodh` folder.
2. Let Gradle sync (it will download the Gradle 8.7 wrapper and dependencies).
3. Plug in your phone with USB debugging on, or start an emulator.
4. Press **Run**.

### Option B - command line

```bash
cd DailyBodh

# Debug build (installs and runs quickly, not optimised)
./gradlew assembleDebug
# -> app/build/outputs/apk/debug/app-debug.apk

# Release build (minified + resource-shrunk, small APK)
./gradlew assembleRelease
# -> app/build/outputs/apk/release/app-release-unsigned.apk
```

On Windows use `gradlew.bat` instead of `./gradlew`.

If you have never built an Android project from the command line, first create
`local.properties` in the project root pointing at your SDK:

```
sdk.dir=/path/to/Android/sdk
```

## Installing the APK on your phone

The debug APK is signed with a throwaway key, so it installs directly:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Or copy the `.apk` to your phone and open it (allow "Install unknown apps" for
your file manager when prompted).

The **release** APK is unsigned. To install it you must sign it first:

```bash
# one-time: create a keystore
keytool -genkey -v -keystore dailybodh.jks -alias dailybodh \
        -keyalg RSA -keysize 2048 -validity 10000

# sign
$ANDROID_HOME/build-tools/34.0.0/apksigner sign \
        --ks dailybodh.jks \
        --out app-release-signed.apk \
        app/build/outputs/apk/release/app-release-unsigned.apk
```

Then `adb install -r app-release-signed.apk`. Keep the keystore file safe; you
need the same one for every future update.

## Adding the widget

1. Long-press an empty spot on your home screen.
2. **Widgets** -> **Daily Bodh**.
3. Drag it out. The setup screen opens: pick a pack, language and look, then
   **Add widget**.
4. To change a widget later, long-press it and choose **Edit** (the widget is
   declared `reconfigurable`). You can also style any widget from the app's
   **Widget** tab.

Each widget is independent: you can have a Gita widget in Hindi, a Business
widget in English and a Motivation widget in a different colour, all at once.

---

## Adding your own content

Everything lives in `app/src/main/assets/content/`. Each pack is one JSON file,
so you can grow a pack, fix a typo or add a whole new category without touching
any Kotlin.

### The shape of a pack

```json
{
  "packId": "gita",
  "packName": "Bhagavad Gita",
  "description": "700 shlokas in order, one per day.",
  "version": 1,
  "ordering": "sequential",
  "items": [
    {
      "id": "gita-2-47",
      "chapter": 2,
      "verse": 47,
      "sanskrit": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। ...",
      "transliteration": "karmaṇy-evādhikāras te mā phaleṣu kadācana ...",
      "translations": {
        "en": "You have a right to your actions alone, never to the fruits of them.",
        "hi": "तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं।"
      },
      "summary_1line": "Do your duty; do not be attached to the result.",
      "summary_2to3line": "Act with full effort, but release your grip on the outcome.",
      "bodh_3to4line": "The verse separates effort from expectation ...",
      "tags": ["duty", "action"]
    }
  ]
}
```

The full machine-readable schema is in `docs/content-schema.json`.

### Field reference

| Field | Type | Used by | Notes |
|---|---|---|---|
| `id` | string | all | Unique inside the pack. Used for favorites. |
| `chapter`, `verse` | int | Gita | Shown as "Chapter 2, Verse 47". |
| `sanskrit` | string | Gita | Original verse. |
| `transliteration` | string | Gita | Roman transliteration. |
| `translations` | object | all | Language code -> text, e.g. `"en"`, `"hi"`. |
| `summary_1line` | string | all | One-line summary. |
| `summary_2to3line` | string | all | Two-to-three line summary. |
| `bodh_3to4line` | string | all | Three-to-four line reflection. |
| `text` | string | quote packs | The quote or thought itself. |
| `author` | string | quote packs | Attribution line. |
| `tags` | array | all | Freeform; handy for searching. |

You can leave out any field you do not need - unknown or missing fields are
handled gracefully.

### The two orderings

* `"ordering": "sequential"` - the Gita. The app advances one item per day in
  file order and loops back to the first when it reaches the end (toggle
  "Repeat from the start" per widget to turn the loop off).
* `"ordering": "daily"` - the quote packs. The app picks
  `dayOfYear % number_of_items`, so the same item shows all day and the pack
  cycles as the year goes on.

### Adding a new pack

1. Copy one of the existing files in `assets/content/` and rename it,
   e.g. `my_quotes.json`. Set a fresh `packId`.
2. Open `data/PackRegistry.kt` and add one line:

   ```kotlin
   PackInfo("myquotes", "content/my_quotes.json", "My Quotes")
   ```
3. Rebuild. The new pack now appears in the library and in the widget setup
   screen.

### Adding a new language

1. Open `data/PackRegistry.kt` and add an entry to `Languages`:

   ```kotlin
   AppLanguage("ta", "Tamil (தமிழ்)")
   ```
2. In each JSON item, add that language code under `translations`:

   ```json
   "translations": { "en": "...", "hi": "...", "ta": "..." }
   ```
3. Rebuild. The language now appears in the picker.

### About the "Inner Thoughts" pack

`osho.json` contains short **original reflections** written for this app. It does
**not** reproduce any copyrighted Osho text. If you want to add your own
contemplative lines, add items to that file - keep them in your own words.

> Note on the quote packs: several attributions are traditional or disputed.
> They are labelled "Attributed to ..." where that is the case. Check any quote
> you plan to rely on before treating the attribution as settled.

---

## How the widget works

* **Daily rotation** - a WorkManager job fires shortly after midnight and
  re-renders every widget, so the day's content changes on its own. You can also
  tap the small **next ›** chip on a widget to move to the following item
  (turn "Change on tap" off if you would rather it stay put).
* **Display mode** - Original / Transliteration / Translation / 1-line / 2-3 line
  / Bodh, per widget.
* **Sizes** - 2x2, 4x2 and 4x4, with the text adapting to the space.
* **Look** - theme, background colour and transparency, shadow, corner radius,
  font colour (8 presets + RGB picker), font size, font style (including a
  Devanagari-friendly option), all per widget, with a live preview in the app.

One implementation note: Jetpack Glance has no true drop-shadow modifier, so the
"Shadow" setting is approximated with a subtle layered background rather than a
real blur. Everything else is rendered as you configure it.

## License / ownership

This is a personal-use project. Content you add is yours; keep the Gita text and
translations you choose within whatever licence they carry.
