require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dictionaryService = require('../src/modules/dictionary/dictionary.service');

async function run() {
  const [apple, greetingVi, autocomplete, sentence] = await Promise.all([
    dictionaryService.search({ query: 'apple', direction: 'en-vi', limit: 5 }),
    dictionaryService.search({ query: 'loi chao', direction: 'vi-en', limit: 5 }),
    dictionaryService.autocomplete('app', 5, 'en-vi'),
    dictionaryService.translateSentence('I have an appointment today.', 'en-vi')
  ]);

  const firstApple = apple.entries[0] || null;
  const byId = firstApple ? await dictionaryService.getById(firstApple.Id) : null;

  console.log(JSON.stringify({
    source: 'api-only',
    apple: {
      total: apple.total,
      first: firstApple && {
        id: firstApple.Id,
        word: firstApple.Word,
        source: firstApple.Source,
        meaningVI: firstApple.MeaningVI
      }
    },
    greetingVi: {
      total: greetingVi.total,
      first: greetingVi.entries[0] && {
        word: greetingVi.entries[0].Word,
        source: greetingVi.entries[0].Source,
        meaningVI: greetingVi.entries[0].MeaningVI
      }
    },
    autocomplete: autocomplete.slice(0, 5),
    sentence,
    byId: byId && {
      id: byId.Id,
      word: byId.Word,
      source: byId.Source
    }
  }, null, 2));
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
