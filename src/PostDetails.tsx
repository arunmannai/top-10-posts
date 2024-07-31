import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
`;

const PostCard = styled.div`
  width: 22%;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-sizing: border-box;
  margin: 10px;

`;

const PostDetails: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [key: number]: User }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postResponse = await axios.get('https://dummyjson.com/posts');
        const firstTenPosts = postResponse.data.posts.slice(0, 10);
        setPosts(firstTenPosts);
        const userIds = [
          ...new Set(firstTenPosts.map((post: Post) => post.userId)),
        ];
        const userPromises = userIds.map((id) =>
          axios.get(`https://dummyjson.com/users/${id}`)
        );
        const userResponses = await Promise.all(userPromises);
        const usersData = userResponses.reduce((acc, response) => {
          const user: User = response.data;
          acc[user.id] = user;
          return acc;
        }, {} as { [key: number]: User });
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Container>
      <h1>Top 10 Posts</h1>
      <Row>
        {posts.map((post: Post) => (
          <PostCard key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>
              <strong>Author:</strong> {users[post.userId]?.firstName}{' '}
              {users[post.userId]?.lastName}
            </p>
          </PostCard>
        ))}
      </Row>
    </Container>
  );
};

export default PostDetails;
