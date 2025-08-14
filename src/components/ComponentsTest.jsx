import Button from './Button';
import Stack from './Stack';

export default () => {
  return (
    <>
      <Stack>
        <Button>일반 버튼</Button>
        <Button variant="primary">강조 버튼</Button>
        <Button variant="invisible">투명 버튼</Button>
        <Button variant="danger">경고 버튼</Button>
      </Stack>

      <br />

      <Stack>
        <Button border="round">일반 버튼</Button>
        <Button variant="primary" border="round">
          강조 버튼
        </Button>
        <Button variant="invisible" border="round">
          투명 버튼
        </Button>
        <Button variant="danger" border="round">
          경고 버튼
        </Button>
      </Stack>

      <br />

      <Stack>
        <Button size="small">일반 버튼</Button>
        <Button variant="primary" size="small">
          강조 버튼
        </Button>
        <Button variant="invisible" size="small">
          투명 버튼
        </Button>
        <Button variant="danger" size="small">
          경고 버튼
        </Button>
      </Stack>

      <br />

      <Stack>
        <Button size="small" border="round">
          일반 버튼
        </Button>
        <Button variant="primary" size="small" border="round">
          강조 버튼
        </Button>
        <Button variant="invisible" size="small" border="round">
          투명 버튼
        </Button>
        <Button variant="danger" size="small" border="round">
          경고 버튼
        </Button>
      </Stack>

      <br />

      <Stack>
        <Button icon="only">
          <span icon="icon">🥺</span>
        </Button>
        <Button icon="left">
          <span icon>🥺</span>
          버튼 문구
        </Button>
        <Button icon="right">
          버튼 문구
          <span icon>🥺</span>
        </Button>
        <Button icon="only" border="round">
          <span icon>🥺</span>
        </Button>
        <Button icon="left" border="round">
          <span icon>🥺</span>
          버튼 문구
        </Button>
        <Button icon="right" border="round">
          버튼 문구
          <span icon>🥺</span>
        </Button>
      </Stack>

      <br />

      <Stack>
        <Button icon="only" size="small">
          <span icon>🥺</span>
        </Button>
        <Button icon="left" size="small">
          <span icon>🥺</span>
          버튼 문구
        </Button>
        <Button icon="right" size="small">
          버튼 문구
          <span icon>🥺</span>
        </Button>
        <Button icon="only" size="small" border="round">
          <span icon>🥺</span>
        </Button>
        <Button icon="left" size="small" border="round">
          <span icon>🥺</span>
          버튼 문구
        </Button>
        <Button icon="right" size="small" border="round">
          버튼 문구
          <span icon>🥺</span>
        </Button>
      </Stack>
    </>
  );
};
