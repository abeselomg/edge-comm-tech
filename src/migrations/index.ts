import * as migration_20261022_170703_initial from './20261022_170703_initial';
import * as migration_20261024_085850_news_holding_state from './20261024_085850_news_holding_state';
import * as migration_20261024_154422_phase6_forms from './20261024_154422_phase6_forms';

export const migrations = [
  {
    up: migration_20261022_170703_initial.up,
    down: migration_20261022_170703_initial.down,
    name: '20261022_170703_initial',
  },
  {
    up: migration_20261024_085850_news_holding_state.up,
    down: migration_20261024_085850_news_holding_state.down,
    name: '20261024_085850_news_holding_state',
  },
  {
    up: migration_20261024_154422_phase6_forms.up,
    down: migration_20261024_154422_phase6_forms.down,
    name: '20261024_154422_phase6_forms'
  },
];
