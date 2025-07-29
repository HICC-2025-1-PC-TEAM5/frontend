import { useState } from 'react';
import { useNavigate } from 'react-router';
import style from './Home.module.css';
import Nav from '../../components/Nav';

export default function () {
  return (
    <>
      <h1>메인 페이지</h1>
      <Nav></Nav>
    </>
  );
}
