#!/usr/bin/env node

/**
 * Builds a complete screenplay by combining individual scene files
 * Reads scene references from the master screenplay file and consolidates them
 *
 * Usage: node build-screenplay.js [output-file]
 * Default output: screenplay/the_pet_complete.fountain
 */

const fs = require('fs');
const path = require('path');

const SCREENPLAY_DIR = path.join(__dirname, 'screenplay');
const MASTER_FILE = path.join(SCREENPLAY_DIR, 'the_pet_screenplay.fountain');
const DEFAULT_OUTPUT = path.join(SCREENPLAY_DIR, 'the_pet_complete.fountain');

/**
 * Build Configuration
 *
 * Customize transitions and formatting here. Common Fountain transitions:
 * - CUT TO:       (standard, default)
 * - FADE IN:      (fade from black)
 * - FADE OUT:     (fade to black)
 * - DISSOLVE TO:  (blend between scenes)
 * - FADE:         (another fade variant)
 * - >Custom       (force any text as transition with > prefix)
 */
const CONFIG = {
  // Transition between scenes
  sceneTransition: 'CUT TO:',

  // Add extra blank line before transition for readability
  extraBlankLineBeforeTransition: true,
};

/**
 * Extract scene file references and their transitions from the master screenplay
 * Looks for patterns like:
 *   See: act_1_scene_01_morning_routine.fountain
 *
 *   CUT TO:
 *
 * Also handles the last scene which may not have a transition after it
 */
function extractSceneReferences(content) {
  // Match: "See: filename.fountain" followed by optional blank lines and optional transition
  const sceneRegex = /See:\s+([^\n]+\.fountain)\s*(?:\n\s*\n\s*([A-Z0-9>][^\n]*))?/g;
  const references = [];
  let match;

  while ((match = sceneRegex.exec(content)) !== null) {
    const filename = match[1].trim();
    // If no transition captured (last scene), use a default
    const transition = match[2] ? match[2].trim() : 'CUT TO:';

    references.push({
      file: filename,
      transition: transition,
    });
  }

  return references;
}

/**
 * Read and validate a scene file
 */
function readSceneFile(filename) {
  const filepath = path.join(SCREENPLAY_DIR, filename);

  if (!fs.existsSync(filepath)) {
    throw new Error(`Scene file not found: ${filename}`);
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  return content;
}

/**
 * Build the complete screenplay
 */
function buildScreenplay() {
  console.log(`📖 Building screenplay from: ${MASTER_FILE}`);

  // Read master file
  const masterContent = fs.readFileSync(MASTER_FILE, 'utf-8');

  // Extract scene references in order
  const sceneReferences = extractSceneReferences(masterContent);

  if (sceneReferences.length === 0) {
    throw new Error('No scene references found in master file');
  }

  console.log(`📋 Found ${sceneReferences.length} scenes to combine\n`);

  // Build output content
  let output = '';
  let sceneCount = 0;

  // Add title page section (copy everything up to the first CUT TO)
  const titleMatch = masterContent.match(/^[\s\S]*?(?=CUT TO:|ACT I, SCENE)/);
  if (titleMatch) {
    output += titleMatch[0].trim() + '\n\n';
  }

  // Combine all scenes
  for (let i = 0; i < sceneReferences.length; i++) {
    const sceneRef = sceneReferences[i];
    const sceneFile = sceneRef.file;
    const transition = sceneRef.transition;

    try {
      const sceneContent = readSceneFile(sceneFile);
      const cleanedContent = sceneContent.trim();

      output += cleanedContent;
      sceneCount++;

      // Add transition between scenes (but not after the last scene)
      if (i < sceneReferences.length - 1) {
        const blankLine = CONFIG.extraBlankLineBeforeTransition ? '\n' : '';
        output += '\n' + blankLine + '\n' + transition + '\n\n';
      }
    } catch (error) {
      console.error(`❌ Error reading ${sceneFile}: ${error.message}`);
      process.exit(1);
    }
  }

  output += '\n\n' + '='.repeat(79) + '\n\n';
  output += 'END OF SCREENPLAY\n';

  return output;
}

/**
 * Main execution
 */
function main() {
  try {
    const outputFile = process.argv[2] || DEFAULT_OUTPUT;

    console.log('🎬 THE PET - Screenplay Builder\n');

    const screenplay = buildScreenplay();

    // Write output file
    fs.writeFileSync(outputFile, screenplay, 'utf-8');

    const fileSize = (screenplay.length / 1024).toFixed(2);
    console.log(`✅ Complete screenplay written to: ${path.relative('.', outputFile)}`);
    console.log(`📄 File size: ${fileSize} KB`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
