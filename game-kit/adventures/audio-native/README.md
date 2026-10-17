# Titi native English voice

Voice: en-US-AnaNeural (female, en-US, Cute / Cartoon). All recordings use this one voice at +3% rate and +0Hz pitch. Source questions remain unchanged. Fill-in gaps use the existing nonverbal gap cue. The engine never falls back to a Vietnamese or device-default voice.

Regenerate with `game-kit/tools/build-native-voice.py` and an extracted list of the current spoken scenes/prompts. The manifest records the exact speech text per file. Existing successful clips are resumed. Publish only when every recording succeeds.
