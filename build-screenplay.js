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
 * Build the complete screenplay by replacing "See: filename" with actual content
 */
function buildScreenplay() {
  console.log(`📖 Building screenplay from: ${MASTER_FILE}`);

  // Read master file
  let output = fs.readFileSync(MASTER_FILE, 'utf-8');

  // Find all "See: filename.fountain" references and replace with actual content
  const seeRegex = /See:\s+([^\n]+\.fountain)/g;
  let sceneCount = 0;
  let match;

  // We need to track matches separately since we're modifying the string
  const matches = [];
  while ((match = seeRegex.exec(output)) !== null) {
    matches.push({
      fullMatch: match[0],
      filename: match[1].trim(),
      index: match.index,
    });
  }

  // Process matches in reverse order to maintain correct indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const matchInfo = matches[i];
    try {
      const sceneContent = readSceneFile(matchInfo.filename);
      // Replace "See: filename" with the actual scene content
      output = output.substring(0, matchInfo.index) + sceneContent + output.substring(matchInfo.index + matchInfo.fullMatch.length);
      sceneCount++;
    } catch (error) {
      console.error(`❌ Error reading ${matchInfo.filename}: ${error.message}`);
      process.exit(1);
    }
  }

  console.log(`📋 Replaced ${sceneCount} scene references\n`);

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
