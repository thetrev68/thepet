# Building the Complete Screenplay

The screenplay is organized as individual scene files for easier editing and collaboration. Use the build script to combine all scenes into a single file for printing and sharing.

## Quick Start

### Windows
```bash
build-screenplay.bat
```

### macOS / Linux
```bash
./build-screenplay.sh
```

Or directly with Node:
```bash
node build-screenplay.js
```

## Output

The build script generates: `screenplay/the_pet_complete.fountain`

This file contains:
- Title page and act separators from the master screenplay
- All 38 scenes in correct story order
- Transitions between scenes (as defined in the master file)
- Proper Fountain formatting for printing and screenwriting software

## How It Works

1. **Reads the master file** (`screenplay/the_pet_screenplay.fountain`) to determine scene order and transitions
2. **Extracts scene references and their transitions** from patterns like:
   ```
   See: act_1_scene_01_morning_routine.fountain

   CUT TO:
   ```
3. **Combines all scenes** in the correct sequence
4. **Adds the same transitions** specified in the master file between scenes
5. **Writes output** to a single Fountain file

## Customizing Transitions

You can use different transitions between scenes by editing the master screenplay file (`screenplay/the_pet_screenplay.fountain`). Just change the transition text that appears after each scene reference.

**Valid Fountain transitions:**
- `CUT TO:` (default - immediate hard cut)
- `FADE IN:` (fade from black)
- `FADE OUT:` (fade to black)
- `DISSOLVE TO:` (smooth blend between scenes)
- `>Custom transition` (custom text - use `>` prefix for non-standard transitions)

After editing the master file, simply run the build script again to regenerate with your new transitions.

## Custom Output Location

To save the complete screenplay to a different location:

```bash
# Windows
build-screenplay.bat path/to/output.fountain

# macOS / Linux
./build-screenplay.sh path/to/output.fountain

# Direct Node
node build-screenplay.js path/to/output.fountain
```

## Dependencies

- Node.js (any modern version)
- No npm packages required

## Workflow

After making revisions to individual scene files:

1. Run the build script: `build-screenplay.bat` (or `.sh`)
2. The new complete screenplay is generated
3. Use the output file for printing, sharing, or submission

## Scene Organization

Scenes are organized by act and scene number:
- **Act I**: Scenes 01-20 (Domestication)
- **Act II**: Scenes 01-13 (Escape & Adaptation)
- **Act III**: Scenes 01-05 (Rebellion & Freedom)

The build script reads the order from the master file, so if you add or reorder scenes, just update `the_pet_screenplay.fountain` with the new references.

## Notes

- The build script is repeatable—run it as many times as needed
- Individual scene files are never modified
- The output file can be opened in any Fountain-compatible screenwriting software
- The script validates that all referenced scene files exist before building
- Transitions are read directly from the master screenplay file, so you can customize them on a per-scene basis
