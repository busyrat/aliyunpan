const { db } = require('@vercel/postgres');
const {
  files
} = require('../app/lib/placeholder-data.js');

async function seedFiles(client) {
  try {
    // Create the "files" table if it doesn't exist
    const createTable = await client.sql`
      DROP TABLE IF EXISTS files;
      CREATE TABLE files (
          name VARCHAR(255),
          drive_id VARCHAR(255),
          domain_id VARCHAR(255),
          file_id VARCHAR(255) PRIMARY KEY,
          share_id VARCHAR(255),
          type VARCHAR(50),
          created_at TIMESTAMP,
          updated_at TIMESTAMP,
          parent_file_id VARCHAR(255),
          file_extension VARCHAR(50),
          mime_type VARCHAR(100),
          mime_extension VARCHAR(50),
          size BIGINT,
          category VARCHAR(50),
          punish_flag INT
      )
    `;

    console.log(`Created "files" table`);

    // Insert data into the "files" table
    const insertedFiles = await Promise.all(
      files.map(
        (item) => client.sql`
        INSERT INTO files (name, drive_id, domain_id, file_id, share_id, type, created_at, updated_at, parent_file_id, file_extension, mime_type, mime_extension, size, category, punish_flag)
        VALUES (${item.name}, ${item.drive_id}, ${item.domain_id}, ${item.file_id}, ${item.share_id}, ${item.type}, ${item.created_at}, ${item.updated_at}, ${item.parent_file_id},  ${item.file_extension}, ${item.mime_type}, ${item.mime_extension}, ${item.size}, ${item.category}, ${item.punish_flag})
        ON CONFLICT (file_id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedFiles.length} files`);

    return {
      createTable,
      files: insertedFiles,
    };
  } catch (error) {
    console.error('Error seeding files:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedFiles(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});

