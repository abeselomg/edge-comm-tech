import * as migration_20261022_170703_initial from './20261022_170703_initial';
import * as migration_20261024_085850_news_holding_state from './20261024_085850_news_holding_state';
import * as migration_20261024_154422_phase6_forms from './20261024_154422_phase6_forms';
import * as migration_20261026_130454_features_projects_images_hr_role from './20261026_130454_features_projects_images_hr_role';

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
    name: '20261024_154422_phase6_forms',
  },
  {
    up: migration_20261026_130454_features_projects_images_hr_role.up,
    down: migration_20261026_130454_features_projects_images_hr_role.down,
    name: '20261026_130454_features_projects_images_hr_role'
  },
];
