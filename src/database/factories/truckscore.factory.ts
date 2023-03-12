import { TruckScore } from '../../truck-score/truck-score.entity';
import { define } from 'typeorm-seeding';

define(TruckScore, () => {
  return new TruckScore();
});
