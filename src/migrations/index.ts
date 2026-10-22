import * as migration_20261022_170703_initial from './20261022_170703_initial';

export const migrations = [
  {
    up: migration_20261022_170703_initial.up,
    down: migration_20261022_170703_initial.down,
    name: '20261022_170703_initial'
  },
];
