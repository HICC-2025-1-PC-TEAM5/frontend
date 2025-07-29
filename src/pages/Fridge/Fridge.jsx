import { useState } from 'react';
import { useNavigate } from 'react-router';
import style from './Fridge.module.css';
import Nav from '../../components/Nav';

export default function () {
  return (
    <>
      <h1>냉장고</h1>
      <Nav></Nav>
    </>
  );
}
