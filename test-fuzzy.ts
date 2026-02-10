
import { fuzzyMatch } from './lib/fuzzySearch';

console.log("Testing fuzzyMatch...");

const query = "what is time?";
const target = "what is time?";

const result = fuzzyMatch(query, target);
console.log(`Query: "${query}" | Target: "${target}" | Score:`, result ? result.score : "NULL");

const query2 = "what time";
const result2 = fuzzyMatch(query2, target);
console.log(`Query: "${query2}" | Target: "${target}" | Score:`, result2 ? result2.score : "NULL");

const query3 = "ai answer";
const target3 = "AI Answer for \"what is time?\"";
const result3 = fuzzyMatch(query3, target3);
console.log(`Query: "${query3}" | Target: "${target3}" | Score:`, result3 ? result3.score : "NULL");
