import { useState } from 'react';
import { useNavigate } from 'react-router';
import './Fridge.css';
import Nav from '../../components/Nav';
import Stack from '../../components/Stack';
import ImageCard from '../../components/ImageCard';
import ImageCoin from '../../components/ImageCoin';

export default function () {
  return (
    <>
      <div className="header">
        <div className="outwrapper">
          <div className="inwrapper">
            <h1>냉장고</h1>
          </div>
        </div>
      </div>

      <div className="index">
        <div className="nav">
          <div className="filter">
            <div className="outwrapper">
              <div className="inwrapper">
                <Stack className="stack" align="center">
                  <div className="button">전체 27</div>
                  <div className="button selected">냉장보관 14</div>
                  <div className="button">냉동보관 5</div>
                  <div className="button">실온보관 39</div>
                </Stack>
              </div>
            </div>
          </div>

          <div className="category">
            <div className="outwrapper">
              <div className="inwrapper">
                <Stack className="stack" align="center">
                  <div className="button">전체</div>
                  <div className="button selected">채소</div>
                  <div className="button">과일</div>
                  <div className="button">고기 · 해산물</div>
                  <div className="button">계란 · 유제품</div>
                  <div className="button">양념 · 조미료</div>
                </Stack>
              </div>
            </div>
          </div>

          <div className="sort">
            <div className="outwrapper">
              <div className="inwrapper">
                <Stack className="stack" justify="space-between">
                  <div className="count">재료 6개</div>
                  <div className="select">최신순</div>
                </Stack>
              </div>
            </div>
          </div>
        </div>

        <div className="list">
          <div className="outwrapper">
            <div className="inwrapper">
              <Stack className="stack" wrap="wrap" rows="3">
                <ImageCard></ImageCard>
                <ImageCard></ImageCard>
                <ImageCard></ImageCard>
                <ImageCard></ImageCard>
                <ImageCard></ImageCard>
                <ImageCard></ImageCard>
              </Stack>
            </div>
          </div>
        </div>
      </div>

      <div className="recommands">
        <div className="message">
          <div className="outwrapper">
            <div className="inwrapper">
              <p>이 재료들은 구비하는 게 어떨가요?</p>
            </div>
          </div>
        </div>

        <div className="list">
          <div className="outwrapper">
            <div className="inwrapper">
              <Stack className="stack" wrap="wrap">
                <ImageCoin></ImageCoin>
                <ImageCoin></ImageCoin>
                <ImageCoin></ImageCoin>
                <ImageCoin></ImageCoin>
                <ImageCoin></ImageCoin>
                <ImageCoin></ImageCoin>
              </Stack>
            </div>
          </div>
        </div>
      </div>
      <Nav></Nav>
    </>
  );
}
