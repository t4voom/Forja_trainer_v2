/* FORJA Trainer — "Store" mínimo para a biblioteca de exercícios (js/shared/exercises.js)
   No app, o Store guarda os dados do aluno no aparelho. Aqui ele só guarda os exercícios
   personalizados do aluno aberto no momento (vindos da API), para os nomes aparecerem certos. */
window.Store = (function () {
  var custom = [];
  return {
    get: function (key) { return key === 'exercises' ? custom : key === 'settings' ? { unit: 'kg' } : []; },
    update: function () {},
    set: function () {},
    setCustomExercises: function (list) { custom = Object.freeze((list || []).slice()); }
  };
})();
