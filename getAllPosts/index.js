const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD,
});

const Post = sequelize.define('Post', {
  PostID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  UserID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  MediaLink: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  CreatedAt: {
    type: Sequelize.DATE,  // Assuming you have a field named CreatedAt
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

exports.handler = async (event, context) => {
  const antwortFrontend = {
    status: "ok",
  };
  try {
    // Update the findAll query to order by CreatedAt in descending order
    const posts = await Post.findAll({
      order: [['CreatedAt', 'DESC']],
    });

    const formattedPosts = posts.map(post => ({
      id: post.PostID,
      user_id: post.UserID,
      content: post.content,
      MediaLink: post.MediaLink,
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: "ok",
        posts: formattedPosts,
      }),
    };
  } catch (error) {
    console.error('Error retrieving posts:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Error retrieving posts',
      }),
    };
  }
};
