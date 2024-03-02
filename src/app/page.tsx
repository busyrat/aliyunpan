import React from 'react';
import { Button } from 'antd';
import Link from 'next/link'

const Home = () => (
  <main className="flex flex-col justify-center items-center">
    <h1 className="text-6xl mb-10">阿里云盘分享订阅</h1>
    <Link href="/dashboard">
      <Button type="primary">dashboard</Button>
    </Link>
  </main>
);

export default Home;