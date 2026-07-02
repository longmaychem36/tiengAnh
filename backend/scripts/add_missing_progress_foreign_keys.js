require('dotenv').config({ path: '.env' });

const db = require('../src/config/database');

const foreignKeys = [
  {
    constraintName: 'grammarprogress_userid_fkey',
    orphanLabel: 'grammarprogress.userid -> users.id',
    orphanQuery: `
      select count(*)::int as orphan_count
      from grammarprogress gp
      left join users u on u.id = gp.userid
      where u.id is null
    `,
    alterSql: `
      alter table grammarprogress
      add constraint grammarprogress_userid_fkey
      foreign key (userid) references users(id) on delete cascade
    `,
  },
  {
    constraintName: 'readingprogress_userid_fkey',
    orphanLabel: 'readingprogress.userid -> users.id',
    orphanQuery: `
      select count(*)::int as orphan_count
      from readingprogress rp
      left join users u on u.id = rp.userid
      where u.id is null
    `,
    alterSql: `
      alter table readingprogress
      add constraint readingprogress_userid_fkey
      foreign key (userid) references users(id) on delete cascade
    `,
  },
  {
    constraintName: 'listeningprogress_userid_fkey',
    orphanLabel: 'listeningprogress.userid -> users.id',
    orphanQuery: `
      select count(*)::int as orphan_count
      from listeningprogress lp
      left join users u on u.id = lp.userid
      where u.id is null
    `,
    alterSql: `
      alter table listeningprogress
      add constraint listeningprogress_userid_fkey
      foreign key (userid) references users(id) on delete cascade
    `,
  },
  {
    constraintName: 'speakingprogress_userid_fkey',
    orphanLabel: 'speakingprogress.userid -> users.id',
    orphanQuery: `
      select count(*)::int as orphan_count
      from speakingprogress sp
      left join users u on u.id = sp.userid
      where u.id is null
    `,
    alterSql: `
      alter table speakingprogress
      add constraint speakingprogress_userid_fkey
      foreign key (userid) references users(id) on delete cascade
    `,
  },
  {
    constraintName: 'speakingprogress_lessonid_fkey',
    orphanLabel: 'speakingprogress.lessonid -> speakinglessons.id',
    orphanQuery: `
      select count(*)::int as orphan_count
      from speakingprogress sp
      left join speakinglessons sl on sl.id = sp.lessonid
      where sl.id is null
    `,
    alterSql: `
      alter table speakingprogress
      add constraint speakingprogress_lessonid_fkey
      foreign key (lessonid) references speakinglessons(id) on delete cascade
    `,
  },
  {
    constraintName: 'writingprogress_userid_fkey',
    orphanLabel: 'writingprogress.userid -> users.id',
    orphanQuery: `
      select count(*)::int as orphan_count
      from writingprogress wp
      left join users u on u.id = wp.userid
      where u.id is null
    `,
    alterSql: `
      alter table writingprogress
      add constraint writingprogress_userid_fkey
      foreign key (userid) references users(id) on delete cascade
    `,
  },
  {
    constraintName: 'writingprogress_lessonid_fkey',
    orphanLabel: 'writingprogress.lessonid -> writinglessons.id',
    orphanQuery: `
      select count(*)::int as orphan_count
      from writingprogress wp
      left join writinglessons wl on wl.id = wp.lessonid
      where wl.id is null
    `,
    alterSql: `
      alter table writingprogress
      add constraint writingprogress_lessonid_fkey
      foreign key (lessonid) references writinglessons(id) on delete cascade
    `,
  },
];

async function constraintExists(pool, constraintName) {
  const result = await pool.query(
    `
      select 1
      from pg_constraint
      where connamespace = 'public'::regnamespace
        and conname = $1
      limit 1
    `,
    [constraintName]
  );

  return result.rows.length > 0;
}

async function getOrphanCount(pool, orphanQuery) {
  const result = await pool.query(orphanQuery);
  return result.rows[0]?.orphan_count ?? 0;
}

async function main() {
  await db.connectDB();
  const pool = db.getPool();
  const client = await pool.connect();

  try {
    for (const foreignKey of foreignKeys) {
      const orphanCount = Number(await getOrphanCount(pool, foreignKey.orphanQuery));
      if (orphanCount > 0) {
        throw new Error(
          `${foreignKey.orphanLabel} has ${orphanCount} orphan rows. Resolve data before adding the constraint.`
        );
      }
    }

    await client.query('begin');

    for (const foreignKey of foreignKeys) {
      const exists = await constraintExists(pool, foreignKey.constraintName);
      if (exists) {
        console.log(`skip ${foreignKey.constraintName}`);
        continue;
      }

      await client.query(foreignKey.alterSql);
      console.log(`added ${foreignKey.constraintName}`);
    }

    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
    await db.closeDB();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
