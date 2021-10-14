/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { InputError } from '@backstage/errors';
import { Knex } from 'knex';
import { DateTime, Duration } from 'luxon';

// Keep the IDs compatible with e.g. Prometheus
export function validateId(id: string) {
  if (typeof id !== 'string' || !/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(id)) {
    throw new InputError(
      `${id} is not a valid ID, expected string of lowercase characters and digits separated by underscores`,
    );
  }
}

export function dbTime(t: Date | string): DateTime {
  if (typeof t === 'string') {
    return DateTime.fromSQL(t);
  }
  return DateTime.fromJSDate(t);
}

export function nowPlus(duration: Duration | undefined, knex: Knex) {
  const seconds = duration?.as('seconds') ?? 0;
  if (!seconds) {
    return knex.fn.now();
  }
  return knex.client.config.client === 'sqlite3'
    ? knex.raw(`datetime('now', ?)`, [`${seconds} seconds`])
    : knex.raw(`now() + interval '${seconds} seconds'`);
}
