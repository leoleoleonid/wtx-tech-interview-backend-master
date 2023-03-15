import { TruckScore } from '../../src/__old/truck-score/truck-score.entity';
import { define } from 'typeorm-seeding';

define(TruckScore, () => {
  return new TruckScore();
});
