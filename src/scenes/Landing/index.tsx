import { Container, Paper } from '@mantine/core';

function Landing() {
  return (
    <main>
      <Container size="xs" px="xs">
        <Paper shadow="xs" p="md">
          {'Home page'}
        </Paper>
      </Container>
    </main>
  );
}

export default Landing;
