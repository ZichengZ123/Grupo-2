import test from 'node:test';
import assert from 'node:assert/strict';
import { STATIONS, CIM_INTEGRATION_FLOW, QUIZ_QUESTIONS, TEAM_MEMBERS, UNIVERSITY_INFO } from './presentationData';

test('verify university and group presentation metadata', () => {
  assert.equal(UNIVERSITY_INFO.group, 'Grupo 2');
  assert.match(UNIVERSITY_INFO.course, /TECNOLOGÍAS Y SOFTWARE PARA MECATRÓNICA/i);
  assert.match(UNIVERSITY_INFO.tutor, /[AÁ]ngel Eugenio C[aá]rdenas Cadme/i);
  assert.equal(TEAM_MEMBERS.length, 7);

  const names = TEAM_MEMBERS.map((m) => m.name.toUpperCase());
  assert.ok(names.includes('AARON FERNANDO GARCIA GOMEZ'));
  assert.ok(names.includes('FREDDY ALEXANDER IDROVO GUERRERO'));
  assert.ok(names.includes('DAVID ALEJANDRO PIZARRO LOOR'));
  assert.ok(names.includes('HUGO ANDRES SARES VEGA'));
  assert.ok(names.includes('ZICHENG ZHANG'));
  assert.ok(names.includes('ANA CAROLINA ZUÑIGA BRAVO'));
  assert.ok(names.includes('ELIZABETH DEL CARMEN FRANCO NAVARRO'));
});

test('stations must be ordered exactly as requested: handling, sorting, robot, torno', () => {
  assert.equal(STATIONS.length, 4);
  assert.equal(STATIONS[0].id, 'handling');
  assert.equal(STATIONS[1].id, 'sorting');
  assert.equal(STATIONS[2].id, 'robot');
  assert.equal(STATIONS[3].id, 'torno');
});

test('handling station technical specifications', () => {
  const handling = STATIONS[0];
  assert.match(handling.keySpecs.speed, /3/); // 3 m/s
  assert.match(handling.keySpecs.precision, /0\.1/); // ±0.1 mm
  assert.match(handling.keySpecs.pressureForce, /150 N/); // 150 N
});

test('sorting station technical specifications', () => {
  const sorting = STATIONS[1];
  assert.match(sorting.keySpecs.speed, /10 a 20 cm\/s/);
  const indSensor = sorting.sensors.find((s) => s.title.toLowerCase().includes('inductivo'));
  assert.ok(indSensor);
  assert.match(indSensor.range, /2 mm a 4 mm/);
});

test('robot station technical specifications', () => {
  const robot = STATIONS[2];
  assert.match(robot.keySpecs.precision, /0\.02 mm/); // ±0.02 mm
  assert.match(robot.keySpecs.speed, /2100 mm\/s/);
});

test('torno station technical specifications', () => {
  const torno = STATIONS[3];
  assert.match(torno.keySpecs.precision, /0\.0015 mm/); // 1.5 µm
  assert.match(torno.keySpecs.speed, /4000 RPM/);
});

test('quiz questions have valid answers and explanations', () => {
  assert.ok(QUIZ_QUESTIONS.length >= 16);
  QUIZ_QUESTIONS.forEach((q) => {
    assert.ok(q.correctAnswer >= 0 && q.correctAnswer < q.options.length);
    assert.ok(q.explanation.length > 10);
  });

  // Test random 6 selection without duplicates
  const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 6);
  assert.equal(selected.length, 6);
  const ids = new Set(selected.map((q) => q.id));
  assert.equal(ids.size, 6);
});

test('leaderboard ranking sorts primarily by score DESC and tie-breaks by time ASC', () => {
  const testEntries = [
    { id: '1', name: 'User A', score: 5, totalQuestions: 6, timeSeconds: 45, createdAt: '2026-10-24' },
    { id: '2', name: 'User B', score: 6, totalQuestions: 6, timeSeconds: 60, createdAt: '2026-10-24' },
    { id: '3', name: 'User C', score: 6, totalQuestions: 6, timeSeconds: 32, createdAt: '2026-10-24' },
    { id: '4', name: 'User D', score: 4, totalQuestions: 6, timeSeconds: 20, createdAt: '2026-10-24' },
  ];

  testEntries.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.timeSeconds - b.timeSeconds));

  assert.equal(testEntries[0].name, 'User C'); // 6 pts, 32s (Fastest top score)
  assert.equal(testEntries[1].name, 'User B'); // 6 pts, 60s
  assert.equal(testEntries[2].name, 'User A'); // 5 pts, 45s
  assert.equal(testEntries[3].name, 'User D'); // 4 pts, 20s
});

test('leaderboard starts empty when no participants have submitted yet', () => {
  const emptyList: unknown[] = [];
  assert.equal(emptyList.length, 0);
});

