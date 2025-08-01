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
        <Button
          icon="only"
          onClick={() => {
            console.log(5);
          }}
        >
          a
        </Button>
      </Stack>
    </>
  );
};
