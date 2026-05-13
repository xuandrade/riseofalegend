export const MOTIVATIONAL_PHRASES = [
  'Cada checkbox marcado é um passo na sua jornada épica.',
  'Seu dragão evolui com cada minuto de foco.',
  'A constância vence o talento desorganizado.',
  'Hoje é um bom dia para derrotar um boss.',
  'Um tópico de cada vez. Você está construindo uma lenda.',
  'O conhecimento é a melhor armadura. Equipe-se hoje.',
  'Lembre-se: ninguém constrói uma legenda em um dia.',
  'A próxima questão é uma chance de provar quem você é.',
  'Hoje você está mais perto da aprovação do que ontem.',
  'O esforço de hoje é a história que você contará amanhã.',
  'Treinar a mente é forjar uma espada invisível.',
  'Disciplina é liberdade. Liberdade de ser quem você quer.',
  'O dragão observa. Faça-o orgulhoso.',
  'Concentrar é o novo superpoder.',
  'Não é o tempo que estuda. É a qualidade da presença.',
];

export function getPhraseOfTheDay() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000,
  );
  return MOTIVATIONAL_PHRASES[dayOfYear % MOTIVATIONAL_PHRASES.length];
}
